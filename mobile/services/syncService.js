import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedReports, deleteReport, getReportsCount, initDB } from './db'; // 🔄 ADDED: Import initDB
import { addPatientData } from '../actions/diseaseReportActions';

// Health-check URL used to verify internet connectivity before attempting sync.
// Using a small, fast endpoint (Google's generate_204) to ensure DNS + HTTP reachability.
const HEALTHCHECK_URL = 'https://clients3.google.com/generate_204';

// Small helper to wait/delay
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Perform a lightweight connectivity check (DNS + HTTP). Returns true when reachable.
async function isInternetReachableFast(timeout = 3000) {
  try {
    // Add a timeout to avoid hanging
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(HEALTHCHECK_URL, { method: 'GET', signal: controller.signal });
    clearTimeout(id);
    // generate_204 returns 204 on success
    return res && (res.status === 204 || (res.status >= 200 && res.status < 400));
  } catch (err) {
    // Network not ready or DNS failed; return false so sync can retry later
    return false;
  }
}

class SyncService {
  constructor() {
    this.isOnline = false;
    this.isSyncing = false;
    this.syncInterval = null;
    this.networkListener = null;
  }

  // Initialize the sync service
  async initialize() {
    console.log('🔄 Initializing Sync Service...');
    
    // 🔄 ADDED: Initialize database first before setting up sync
    // This ensures the database is ready before we try to access it
    try {
      console.log('📱 Initializing database for sync service...');
      await initDB();
      // initDB uses the stable expo-sqlite API and creates the `reports` table if needed.
      // We await it here so subsequent calls to getUnsyncedReports/deleteReport are safe.
      console.log('✅ Database initialized for sync service');
    } catch (error) {
      // Log the original error in detail so runtime logs contain the true cause
      console.error('❌ Failed to initialize database for sync:', error);
      // Rethrow the original error so callers see the real exception and stack
      throw error;
    }
    
    // Check initial network state
    const networkState = await NetInfo.fetch();
    this.isOnline = networkState.isConnected && networkState.isInternetReachable;
    
    console.log(`🌐 Initial network state: ${this.isOnline ? 'Online' : 'Offline'}`);
    
    // Listen for network changes
    this.networkListener = NetInfo.addEventListener((state) => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable;
      
      console.log(`🌐 Network changed: ${this.isOnline ? 'Online' : 'Offline'}`);
      
      // If just came online, start syncing
      if (!wasOnline && this.isOnline) {
        console.log('✅ Network restored - starting sync...');
        this.startSync();
      }
    });

    // Start periodic sync if online (every 30 seconds)
    if (this.isOnline) {
      this.startPeriodicSync();
    }
    
    // Do initial sync
    this.startSync();
  }

  // Start periodic sync
  startPeriodicSync() {
    if (this.syncInterval) return;
    
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.startSync();
      }
    }, 30000); // 30 seconds
    
    console.log('⏰ Periodic sync started (every 30 seconds)');
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏰ Periodic sync stopped');
    }
  }

  // Get network status
  getNetworkStatus() {
    return this.isOnline;
  }

  // Get pending reports count
  async getPendingCount() {
    try {
      const counts = await getReportsCount();
      return counts.pending || 0;
    } catch (error) {
      console.error('❌ Error getting pending count:', error);
      return 0;
    }
  }

  // Main sync function
  async startSync() {
    if (!this.isOnline) {
      console.log('📴 Cannot sync - offline');
      return { success: false, message: 'Device offline' };
    }

    if (this.isSyncing) {
      console.log('🔄 Sync already in progress');
      return { success: false, message: 'Sync in progress' };
    }

    this.isSyncing = true;
    console.log('🔄 Starting sync process...');

    try {
      // Before syncing, do a lightweight connectivity check (guards against
      // transient DNS issues where NetInfo reports online but DNS isn't ready yet).
      const reachable = await isInternetReachableFast();
      if (!reachable) {
        console.log('⚠️ Connectivity preflight failed - network appears unstable. Aborting sync and will retry later.');
        return { success: false, message: 'Network unstable - preflight failed' };
      }

      // Get all pending reports
      const pendingReports = await getUnsyncedReports();
      
      if (pendingReports.length === 0) {
        console.log('✅ No pending reports to sync');
        return { success: true, message: 'No reports to sync', synced: 0 };
      }

      console.log(`📤 Found ${pendingReports.length} reports to sync`);
      
      let syncedCount = 0;
      let failedCount = 0;
      
      // Sync each report one by one with retry/backoff to tolerate transient DNS failures
      for (const report of pendingReports) {
        console.log(`📤 Attempting to sync report ID ${report.id}: ${report.patient_name}`);

        const reportData = {
          patientName: report.patient_name,
          ageGroup: report.age_group,
          latitude: report.latitude,
          longitude: report.longitude,
          locationAccuracy: report.location_accuracy,
          symptoms: report.symptoms, // Already parsed as array
          onsetDate: report.onset_date,
          severity: report.severity,
          description: report.description,
          waterSource: report.water_source,
          reportedBy: report.reported_by,
          reportedByName: report.reported_by_name,
          timestamp: report.timestamp,
        };

        // Try up to N attempts with exponential backoff for transient failures
        let attempts = 0;
        const maxAttempts = 4;
        let synced = false;

        while (attempts < maxAttempts && this.isOnline && !synced) {
          attempts += 1;

          // quick preflight prior to each try to avoid immediate DNS errors
          const ok = await isInternetReachableFast(2000);
          if (!ok) {
            console.log(`⚠️ Preflight false before attempt ${attempts} for report ${report.id}. Will retry later.`);
            break; // abandon this report for now; next loop will retry overall sync
          }

          try {
            const result = await addPatientData(reportData);
            if (result && result.success) {
              await deleteReport(report.id);
              synced = true;
              syncedCount++;
              console.log(`✅ Report ${report.id} synced and deleted successfully (attempt ${attempts})`);
              break;
            }

            // If result indicates failure but not an exception, break and keep for retry later
            console.error(`❌ Failed to sync report ${report.id} (attempt ${attempts}):`, result?.error || 'unknown error');
          } catch (error) {
            // Distinguish DNS/ENOTFOUND vs other errors in logs but keep retrying
            console.error(`❌ Error syncing report ${report.id} on attempt ${attempts}:`, error?.message || error);
          }

          // Exponential backoff before next attempt
          const delay = 500 * Math.pow(2, attempts);
          console.log(`⏳ Waiting ${delay}ms before retrying report ${report.id} (attempt ${attempts + 1})`);
          // Slight pause so DNS / network can stabilise
          // eslint-disable-next-line no-await-in-loop
          await wait(delay);
        }

        if (!synced) {
          failedCount++;
          console.log(`❗ Report ${report.id} not synced after ${attempts} attempts; will retry in next sync window.`);
        }
      }

      console.log(`🎉 Sync completed: ${syncedCount} synced, ${failedCount} failed`);
      
      return {
        success: true,
        message: `Synced ${syncedCount} reports successfully`,
        synced: syncedCount,
        failed: failedCount
      };

    } catch (error) {
      console.error('❌ Sync process failed:', error);
      return {
        success: false,
        message: `Sync failed: ${error.message}`,
        synced: 0,
        failed: 0
      };
    } finally {
      this.isSyncing = false;
    }
  }

  // Manual sync trigger
  async manualSync() {
    console.log('🔄 Manual sync triggered');
    return await this.startSync();
  }

  // Check if currently syncing
  isSyncInProgress() {
    return this.isSyncing;
  }

  // Cleanup
  cleanup() {
    this.stopPeriodicSync();
    
    if (this.networkListener) {
      this.networkListener();
      this.networkListener = null;
    }
    
    console.log('🧹 Sync service cleaned up');
  }
}

// Create singleton instance
const syncService = new SyncService();

export default syncService;

// Export utility functions
export const initializeSync = () => syncService.initialize();
export const startManualSync = () => syncService.manualSync();
export const getNetworkStatus = () => syncService.getNetworkStatus();
export const getPendingReportsCount = () => syncService.getPendingCount();
export const isSyncInProgress = () => syncService.isSyncInProgress();
export const cleanupSync = () => syncService.cleanup();