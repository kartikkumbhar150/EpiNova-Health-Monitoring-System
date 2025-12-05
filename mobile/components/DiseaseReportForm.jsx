import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { diseaseReportStyles } from '../assets/styles/disease-report.styles';
import { COLORS } from '../constants/colors';
import SafeScreen from '../components/SafeScreen';
import { useUser } from '@clerk/clerk-expo';
import { useTranslation } from '../context/LanguageContext';

// Import SQLite database functions
import { initDB, insertReport, getReportsCount } from '../services/db';


const DiseaseReportForm = () => {
  const { t } = useTranslation();
  
  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    ageGroup: '', // Now stores direct age as string
    location: null,
    symptoms: [],
    onsetDate: null,
    severity: '',
    description: '',
    waterSource: '',
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  const { user, isLoaded } = useUser();

  // Initialize SQLite database when component mounts - MUST be before any conditional returns
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('📱 Initializing SQLite database...');
        await initDB();
        setDbInitialized(true);
        // initDB creates the `reports` table using stable expo-sqlite APIs.
        // We await this here so insertReport() can be called safely later.
        console.log('✅ Database initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        Alert.alert('Database Error', 'Failed to initialize local database. Please restart the app.');
      }
    };

    setupDatabase();
  }, []);

  // Generate timestamp on component mount
  useEffect(() => {
    const timestamp = new Date().toISOString();
    setFormData(prev => ({
      ...prev,
      timestamp,
    }));
  }, []);

  // Handle loading state
  if (!isLoaded || !dbInitialized) {
    return (
      <SafeScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: COLORS.text, textAlign: 'center' }}>
            {!isLoaded ? t('common.loading') : 'Initializing database...'}
          </Text>
        </View>
      </SafeScreen>
    );
  }

  // Handle case where user is not available
  if (!user) {
    return (
      <SafeScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: COLORS.primary, textAlign: 'center', fontWeight: '500' }}>{t('report.authRequired')}</Text>
        </View>
      </SafeScreen>
    );
  }

  // Get user information
  const userId = user.id;
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() 
                  || user.emailAddresses[0]?.emailAddress 
                  || 'Unknown User';

  // Options for form fields
  const symptoms = [
    { label: 'Fever', value: 'fever' },
    { label: 'Cough', value: 'cough' },
    { label: 'Shortness of breath', value: 'shortness_breath' },
    { label: 'Fatigue', value: 'fatigue' },
    { label: 'Headache', value: 'headache' },
    { label: 'Body aches', value: 'body_aches' },
    { label: 'Sore throat', value: 'sore_throat' },
    { label: 'Nausea/Vomiting', value: 'nausea_vomiting' },
    { label: 'Diarrhea', value: 'diarrhea' },
    { label: 'Skin rash', value: 'skin_rash' },
    { label: 'Loss of taste/smell', value: 'loss_taste_smell' },
    { label: 'Joint pain', value: 'joint_pain' },
  ];

  const severityLevels = [
    { label: 'Mild', value: 'mild' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Severe', value: 'severe' },
    { label: 'Critical', value: 'critical' },
  ];

  const waterSources = [
    { label: 'Tap water', value: 'tap_water' },
    { label: 'Well water', value: 'well_water' },
    { label: 'Bore well', value: 'bore_well' },
    { label: 'River/Stream', value: 'river_stream' },
    { label: 'Pond/Lake', value: 'pond_lake' },
    { label: 'Bottled water', value: 'bottled_water' },
    { label: 'Tanker water', value: 'tanker_water' },
    { label: 'Other', value: 'other' },
  ];

  // Handle location capture
  const captureLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('report.form.validation.permissionDenied'), t('report.form.validation.locationPermissionRequired'));
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFormData(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        },
      }));
      Alert.alert(t('common.success'), t('report.form.validation.locationCaptured'));
    } catch (error) {
      Alert.alert(t('common.error'), t('report.form.validation.locationCaptureFailed'));
      console.error('Location error:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  // Handle radio button selection
  const handleRadioSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle checkbox selection
  const handleSymptomToggle = (symptomValue) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomValue)
        ? prev.symptoms.filter(s => s !== symptomValue)
        : [...prev.symptoms, symptomValue],
    }));
  };

  // Handle date selection (simplified for now)
  const handleDateSelect = () => {
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      onsetDate: today.toISOString().split('T')[0],
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.patientName.trim()) {
      Alert.alert(t('report.form.validation.error'), t('report.form.validation.patientNameRequired'));
      return false;
    }
    if (!formData.ageGroup || isNaN(formData.ageGroup) || Number(formData.ageGroup) <= 0 || Number(formData.ageGroup) > 150) {
      Alert.alert(t('report.form.validation.error'), t('report.form.validation.validAgeRequired'));
      return false;
    }
    if (!formData.location) {
      Alert.alert(t('report.form.validation.error'), t('report.form.validation.locationRequired'));
      return false;
    }
    if (formData.symptoms.length === 0) {
      Alert.alert(t('report.form.validation.error'), t('report.form.validation.symptomsRequired'));
      return false;
    }
    if (!formData.onsetDate) {
      Alert.alert(t('report.form.validation.error'), t('report.form.validation.onsetDateRequired'));
      return false;
    }
    if (!formData.severity) {
      Alert.alert(t('report.form.validation.error'), t('report.form.validation.severityRequired'));
      return false;
    }
    if (!formData.waterSource) {
      Alert.alert(t('report.form.validation.error'), t('report.form.validation.waterSourceRequired'));
      return false;
    }
    return true;
  };

  // Handle form submission - Save to SQLite
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare complete report data for SQLite
      const reportData = {
        // Patient information
        patientName: formData.patientName,
        ageGroup: formData.ageGroup,
        
        // Location data
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        locationAccuracy: formData.location.accuracy,
        
        // Medical information
        symptoms: formData.symptoms, // Will be stored as JSON string in SQLite
        onsetDate: formData.onsetDate,
        severity: formData.severity,
        description: formData.description,
        waterSource: formData.waterSource,
        
        // ASHA worker information (from Clerk)
        reportedBy: userId,
        reportedByName: userName,
        
        // Metadata
        timestamp: new Date().toISOString(),
      };

      console.log('💾 Saving Disease Report to SQLite:', reportData);
      console.log('👤 Reported by ASHA Worker:', userName, '(ID:', userId, ')');
      
      // Save to SQLite database
      const result = await insertReport(reportData);
      
      if (result.success) {
        console.log(`✅ Report saved to SQLite with ID: ${result.id}`);
        
        // Get updated count for user feedback
        const counts = await getReportsCount();
        
        Alert.alert(
          t('common.success'), 
          `${t('report.form.validation.submitSuccess')}\n\n💾 Saved offline successfully\n📋 Total reports stored: ${counts.total}\n👤 ${t('report.form.reportedBy')}: ${userName}`, 
          [
            {
              text: t('common.ok'),
              onPress: () => {
                // Reset form
                setFormData({
                  patientName: '',
                  ageGroup: '',
                  location: null,
                  symptoms: [],
                  onsetDate: null,
                  severity: '',
                  description: '',
                  waterSource: '',
                  timestamp: new Date().toISOString(),
                });
              },
            },
          ]
        );
      } else {
        throw new Error('Failed to save report to database');
      }
    } catch (error) {
      console.error('❌ SQLite save error:', error);
      Alert.alert(
        t('common.error'), 
        `Failed to save report offline: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const renderRadioGroup = (options, selectedValue, onSelect, fieldName) => (
    <View style={diseaseReportStyles.radioGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            diseaseReportStyles.radioOption,
            selectedValue === option.value && diseaseReportStyles.radioOptionSelected,
          ]}
          onPress={() => onSelect(fieldName, option.value)}
        >
          <View
            style={[
              diseaseReportStyles.radioCircle,
              selectedValue === option.value && diseaseReportStyles.radioCircleSelected,
            ]}
          >
            {selectedValue === option.value && (
              <View style={diseaseReportStyles.radioInner} />
            )}
          </View>
          <Text
            style={[
              diseaseReportStyles.radioText,
              selectedValue === option.value && diseaseReportStyles.radioTextSelected,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCheckboxGroup = (options, selectedValues, onToggle) => (
    <View style={diseaseReportStyles.checkboxGroup}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              diseaseReportStyles.checkboxOption,
              isSelected && diseaseReportStyles.checkboxOptionSelected,
            ]}
            onPress={() => onToggle(option.value)}
          >
            <View
              style={[
                diseaseReportStyles.checkbox,
                isSelected && diseaseReportStyles.checkboxSelected,
              ]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={14} color={COLORS.white} />
              )}
            </View>
            <Text
              style={[
                diseaseReportStyles.checkboxText,
                isSelected && diseaseReportStyles.checkboxTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeScreen>
      <ScrollView style={diseaseReportStyles.scrollContent}>
        <Text style={diseaseReportStyles.title}>{t('report.form.title')}</Text>
        
        {/* ASHA Worker Info Display */}
        <View style={{
          backgroundColor: COLORS.card,
          padding: 12,
          marginHorizontal: 0,
          marginBottom: 16,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.primary,
        }}>
          <Text style={{
            fontSize: 14,
            color: COLORS.textLight,
            fontWeight: '500',
          }}>
            {t('report.form.reportedBy')}: {userName}
          </Text>
        </View>

        {/* Patient Information */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>{t('report.form.sections.patientInfo')}</Text>
          
          <View style={diseaseReportStyles.inputContainer}>
            <Text style={diseaseReportStyles.label}>
              {t('report.form.fields.patientName')} <Text style={diseaseReportStyles.required}>*</Text>
            </Text>
            <TextInput
              style={diseaseReportStyles.textInput}
              placeholder={t('report.form.placeholders.patientName')}
              value={formData.patientName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, patientName: text }))}
            />
          </View>
        </View>

        {/* Age */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>
            {t('report.form.fields.patientAge')} <Text style={diseaseReportStyles.required}>*</Text>
          </Text>
          <View style={diseaseReportStyles.inputContainer}>
            <TextInput
              style={diseaseReportStyles.textInput}
              placeholder={t('report.form.placeholders.patientAge')}
              value={formData.ageGroup}
              onChangeText={(text) => setFormData({ ...formData, ageGroup: text })}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        {/* Location */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>
            {t('report.form.fields.location')} <Text style={diseaseReportStyles.required}>*</Text>
          </Text>
          <View style={diseaseReportStyles.locationContainer}>
            <TouchableOpacity
              style={diseaseReportStyles.locationButton}
              onPress={captureLocation}
              disabled={locationLoading}
            >
              <Text style={diseaseReportStyles.locationButtonText}>
                {locationLoading ? t('report.form.buttons.capturing') : t('report.form.buttons.captureLocation')}
              </Text>
            </TouchableOpacity>
            {formData.location && (
              <Text style={diseaseReportStyles.locationText}>
                Lat: {formData.location.latitude.toFixed(6)}, 
                Lng: {formData.location.longitude.toFixed(6)}
              </Text>
            )}
          </View>
        </View>

        {/* Symptoms */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>
            {t('report.form.fields.symptoms')} <Text style={diseaseReportStyles.required}>*</Text>
          </Text>
          {renderCheckboxGroup(symptoms, formData.symptoms, handleSymptomToggle)}
        </View>

        {/* Onset Date */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>
            {t('report.form.fields.onsetDate')} <Text style={diseaseReportStyles.required}>*</Text>
          </Text>
          <TouchableOpacity style={diseaseReportStyles.dateContainer} onPress={handleDateSelect}>
            <Text
              style={[
                diseaseReportStyles.dateText,
                !formData.onsetDate && diseaseReportStyles.datePlaceholder,
              ]}
            >
              {formData.onsetDate || 'Select onset date'}
            </Text>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Severity */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>
            {t('report.form.fields.severity')} <Text style={diseaseReportStyles.required}>*</Text>
          </Text>
          {renderRadioGroup(severityLevels, formData.severity, handleRadioSelect, 'severity')}
        </View>

        {/* Description */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>{t('report.form.fields.description')}</Text>
          <TextInput
            style={[diseaseReportStyles.textInput, diseaseReportStyles.textArea]}
            placeholder={t('report.form.placeholders.description')}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Water Source */}
        <View style={diseaseReportStyles.section}>
          <Text style={diseaseReportStyles.sectionTitle}>
            {t('report.form.fields.waterSource')} <Text style={diseaseReportStyles.required}>*</Text>
          </Text>
          {renderRadioGroup(waterSources, formData.waterSource, handleRadioSelect, 'waterSource')}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            diseaseReportStyles.submitButton,
            loading && diseaseReportStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={diseaseReportStyles.submitButtonText}>
            {loading ? t('report.form.buttons.submitting') : t('report.form.buttons.submit')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};

export default DiseaseReportForm;