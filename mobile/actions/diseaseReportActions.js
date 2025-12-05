/**
 * Disease Report Actions
 * Functions to handle disease report data operations
 */

/**
 * Add patient data to the database
 * @param {Object} patientData - The disease report data
 * @param {string} patientData.patientName - Patient's full name
 * @param {string} patientData.ageGroup - Patient's age (direct number as string)
 * @param {number} patientData.latitude - GPS latitude
 * @param {number} patientData.longitude - GPS longitude
 * @param {number} patientData.locationAccuracy - GPS accuracy in meters
 * @param {Array<string>} patientData.symptoms - Array of symptom values
 * @param {string} patientData.onsetDate - Symptom onset date (YYYY-MM-DD)
 * @param {string} patientData.severity - Severity level (mild, moderate, severe, critical)
 * @param {string} patientData.description - Free-text symptom description
 * @param {string} patientData.waterSource - Drinking water source
 * @param {string} patientData.reportedBy - ASHA worker Clerk user ID
 * @param {string} patientData.reportedByName - ASHA worker name
 * @returns {Promise<Object>} Response from the API
 */
export const addPatientData = async (patientData) => {
  // Structured return shape so callers can distinguish transient vs permanent errors
  // { success: boolean, transient?: boolean, status?: number, error?: string, data?: any }

  // Use environment variable for API endpoint
  const API_ENDPOINT = __DEV__
    ? `${process.env.EXPO_PUBLIC_CLERK_FRONTEND_API}/api/disease-reports`
    : 'https://nativeapp-a2hg.onrender.com/api/disease-reports';
  const FALLBACK_ENDPOINT = 'http://192.168.43.175:3000/api/disease-reports';
  const FINAL_ENDPOINT = (API_ENDPOINT || '').includes('undefined') ? FALLBACK_ENDPOINT : API_ENDPOINT;

  try {
    console.log(`🌐 Using API endpoint: ${FINAL_ENDPOINT} (DEV: ${__DEV__})`);
    console.log('📱 Environment API URL:', process.env.EXPO_PUBLIC_CLERK_FRONTEND_API);
    console.log('Preparing to submit patient data:', patientData);

    // Validate required fields and return structured failure (non-transient)
    if (!patientData.patientName) {
      return { success: false, transient: false, error: 'Patient name is required' };
    }
    if (!patientData.ageGroup) {
      return { success: false, transient: false, error: 'Patient age is required' };
    }
    if (!patientData.symptoms || patientData.symptoms.length === 0) {
      return { success: false, transient: false, error: 'At least one symptom is required' };
    }
    if (!patientData.reportedBy) {
      return { success: false, transient: false, error: 'Reporter ID is required' };
    }

    const payload = {
      patient_name: patientData.patientName,
      age_group: patientData.ageGroup,
      latitude: patientData.latitude,
      longitude: patientData.longitude,
      location_accuracy: patientData.locationAccuracy,
      symptoms: patientData.symptoms,
      onset_date: patientData.onsetDate,
      severity: patientData.severity,
      description: patientData.description || '',
      water_source: patientData.waterSource,
      reported_by: patientData.reportedBy,
    };

    console.log('Submitting payload to backend:', payload);

    let response;
    try {
      response = await fetch(FINAL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (networkErr) {
      // Network-level error: transient
      console.warn('⚠️ Network error while submitting patient data:', networkErr?.message || networkErr);
      return { success: false, transient: true, error: networkErr?.message || String(networkErr) };
    }

    // Non-OK HTTP responses: classify transient (5xx) vs permanent (4xx)
    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch (e) { body = await response.text().catch(() => null); }
      const isTransient = response.status >= 500 || response.status === 0;
      console.warn(`⚠️ Backend returned ${response.status} (transient=${isTransient})`, body);
      return {
        success: false,
        transient: isTransient,
        status: response.status,
        error: (body && (body.error || body.message)) || response.statusText || 'Server error',
      };
    }

    const result = await response.json();
    console.log('✅ Successfully submitted patient data:', result);
    return { success: true, data: result, message: 'Disease report submitted successfully' };

  } catch (err) {
    // Unexpected internal error: treat as non-transient so it surfaces to developer
    console.error('❌ Unexpected error in addPatientData:', err);
    return { success: false, transient: false, error: err?.message || String(err) };
  }
};

/**
 * Get all disease reports (for future use)
 * @returns {Promise<Array>} Array of disease reports
 */
export const getDiseaseReports = async () => {
  try {
    // TODO: Implement when needed
    console.log('📋 Getting disease reports...');
    
    // Temporary mock data
    return [];
  } catch (error) {
    console.error('❌ Error fetching disease reports:', error);
    throw error;
  }
};

/**
 * Get disease reports by ASHA worker (for future use)
 * @param {string} workerId - ASHA worker's Clerk user ID
 * @returns {Promise<Array>} Array of disease reports by the worker
 */
export const getDiseaseReportsByWorker = async (workerId) => {
  try {
    // TODO: Implement when needed
    console.log('📋 Getting disease reports for worker:', workerId);
    
    // Temporary mock data
    return [];
  } catch (error) {
    console.error('❌ Error fetching worker reports:', error);
    throw error;
  }
};