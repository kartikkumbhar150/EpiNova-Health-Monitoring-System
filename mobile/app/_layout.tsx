import { Slot } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { COLORS } from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import { UserRoleProvider } from "../context/UserRoleContext";
import { LanguageProvider } from "../context/LanguageContext";

// 🔄 ADDED: Import React useEffect hook for lifecycle management
import { useEffect } from 'react';

// 🔄 ADDED: Import sync service functions for automatic background syncing
// This enables offline-first functionality across the entire app
import { initializeSync, cleanupSync } from '../services/syncService';



export default function RootLayout() {
  // 🔄 ADDED: Initialize sync service when app starts
  // This runs once when the app launches and sets up automatic syncing
  useEffect(() => {
    let isSyncInitialized = false;

    const startSyncService = async () => {
      try {
        console.log('🚀 App started - Initializing sync service...');
        
        // Initialize sync service - this will:
        // 1. Check current network status
        // 2. Set up network change listeners
        // 3. Start automatic sync when online
        // 4. Monitor for pending reports to sync
        await initializeSync();
        isSyncInitialized = true;
        
        console.log('✅ Sync service initialized - Auto-sync now active!');
        console.log('📱 The app will now automatically sync reports when online');
      } catch (error) {
        console.error('❌ Failed to initialize sync service:', error);
      }
    };

    // Start sync service immediately when app launches
    startSyncService();

    // 🧹 CLEANUP: Stop sync service when app closes or component unmounts
    // This prevents memory leaks and properly cleans up network listeners
    return () => {
      if (isSyncInitialized) {
        console.log('🛑 App closing - Cleaning up sync service...');
        cleanupSync();
        console.log('✅ Sync service cleaned up properly');
      }
    };
  }, []); // Empty dependency array = runs only once on app startup

  return (
    <ClerkProvider tokenCache={tokenCache} >
      <LanguageProvider>
        <UserRoleProvider>
          <StatusBar 
            barStyle="dark-content" 
            backgroundColor={COLORS.background}
            translucent={false}
          />
          <SafeScreen>
            <Slot />
          </SafeScreen>
        </UserRoleProvider>
      </LanguageProvider>
    </ClerkProvider>
  )
}
