import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  StyleSheet 
} from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import GlobalStyles from '../../constants/globalStyles'
import { useTranslation } from '../../context/LanguageContext'

const WaterQuality = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    village: '',
    waterPH: '',
    waterTemperature: '',
    turbidity: '',
    dissolvedOxygen: '',
    chloride: '',
    solarRadiation: '',
    arsenic: '',
    sanitationCoverage: '',
    fecalColiform: '',
    totalDissolvedSolids: '',
    lead: '',
    sulphate: '',
    cod: '',
    nitrate: '',
    bod: '',
    heavyMetalsIndex: '',
    airTemperature: '',
    ammonia: '',
    populationDensity: '',
    windSpeed: '',
    rainfallLevel: 'Low',
    humidityLevel: 'Low',
    floodRisk: 'Low',
    sewageTreatmentQuality: 'Poor',
    wasteManagementQuality: 'Poor',
    landUseType: 'Agricultural'
  })

  // West Siang villages - actual village names from West Siang district
  const westSiangVillages = [
    'Biru', 'Bole', 'Bopu', 'Botak-Kayi', 'Doko Putu', 'Dordi',
    'Dumde Kayi', 'Esse Kerte', 'Esse Lipu', 'Esse Taloh', 'Esse Tamen',
    'Esse-Abe', 'Kapen', 'Khela Ronya', 'Legi', 'Ligo', 'Ligok Kayi',
    'Liromoba', 'Liromoba H.Q', 'Lirum', 'Moya Ronya', 'Pokto',
    'Rikpu Ronya', 'Rise', 'Sari likar'
  ]

  const levelOptions = ['Very Low', 'Low', 'Moderate', 'High', 'High Risk']
  const qualityOptions = ['Poor', 'Moderate', 'Good']
  const landUseOptions = ['Agricultural', 'Urban', 'Industrial', 'Forest', 'Residential']

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const requiredFields = [
      'village', 'waterPH', 'waterTemperature', 'turbidity', 'dissolvedOxygen',
      'chloride', 'fecalColiform', 'totalDissolvedSolids', 'populationDensity'
    ]
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        Alert.alert(t('waterQuality.validationError'), `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    Alert.alert(
      t('common.success'), 
      t('waterQuality.success'),
      [{ text: t('common.ok'), onPress: clearForm }]
    )
  }

  const clearForm = () => {
    setFormData({
      village: '',
      waterPH: '',
      waterTemperature: '',
      turbidity: '',
      dissolvedOxygen: '',
      chloride: '',
      solarRadiation: '',
      arsenic: '',
      sanitationCoverage: '',
      fecalColiform: '',
      totalDissolvedSolids: '',
      lead: '',
      sulphate: '',
      cod: '',
      nitrate: '',
      bod: '',
      heavyMetalsIndex: '',
      airTemperature: '',
      ammonia: '',
      populationDensity: '',
      windSpeed: '',
      rainfallLevel: 'Low',
      humidityLevel: 'Low',
      floodRisk: 'Low',
      sewageTreatmentQuality: 'Poor',
      wasteManagementQuality: 'Poor',
      landUseType: 'Agricultural'
    })
  }

  const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', required = false }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        keyboardType={keyboardType}
      />
    </View>
  )

  const FormPicker = ({ label, selectedValue, onValueChange, items, required = false }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={onValueChange}
          dropdownIconColor={COLORS.primary}
          mode="dropdown"
        >
          {label === 'Village' && <Picker.Item label={t('waterQuality.selectVillage')} value="" />}
          {items.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
        <View style={styles.pickerIcon}>
          <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView style={GlobalStyles.container} contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}>
      {/* Header */}
      <View style={[GlobalStyles.card, styles.header]}>
        <View style={styles.headerIcon}>
          <Ionicons name="water" size={24} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[GlobalStyles.heading, styles.headerTitle]}>{t('waterQuality.title')}</Text>
          <Text style={[GlobalStyles.bodySmall, styles.headerSubtitle]}>{t('waterQuality.subtitle')}</Text>
        </View>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Village Selection */}
        <FormPicker
          label={t('waterQuality.village')}
          selectedValue={formData.village}
          onValueChange={(value) => updateFormData('village', value)}
          items={westSiangVillages}
          required
        />

        {/* Water Quality Parameters */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('waterQuality.waterParameters')}</Text>
        </View>

        <FormInput
          label="Water pH"
          value={formData.waterPH}
          onChangeText={(value) => updateFormData('waterPH', value)}
          placeholder="e.g., 7.2"
          keyboardType="decimal-pad"
          required
        />

        <FormInput
          label="Water Temperature (°C)"
          value={formData.waterTemperature}
          onChangeText={(value) => updateFormData('waterTemperature', value)}
          placeholder="e.g., 25.5"
          keyboardType="decimal-pad"
          required
        />

        <FormInput
          label="Turbidity (NTU)"
          value={formData.turbidity}
          onChangeText={(value) => updateFormData('turbidity', value)}
          placeholder="e.g., 1.5"
          keyboardType="decimal-pad"
          required
        />

        <FormInput
          label="Dissolved Oxygen (mg/L)"
          value={formData.dissolvedOxygen}
          onChangeText={(value) => updateFormData('dissolvedOxygen', value)}
          placeholder="e.g., 8.2"
          keyboardType="decimal-pad"
          required
        />

        <FormInput
          label="Chloride (mg/L)"
          value={formData.chloride}
          onChangeText={(value) => updateFormData('chloride', value)}
          placeholder="e.g., 15.0"
          keyboardType="decimal-pad"
          required
        />

        <FormInput
          label="Fecal Coliform (CFU/100ml)"
          value={formData.fecalColiform}
          onChangeText={(value) => updateFormData('fecalColiform', value)}
          placeholder="e.g., 100"
          keyboardType="numeric"
          required
        />

        <FormInput
          label="Total Dissolved Solids (mg/L)"
          value={formData.totalDissolvedSolids}
          onChangeText={(value) => updateFormData('totalDissolvedSolids', value)}
          placeholder="e.g., 500"
          keyboardType="numeric"
          required
        />

        {/* Chemical Parameters */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('waterQuality.chemicalParameters')}</Text>
        </View>

        <FormInput
          label="Arsenic (µg/L)"
          value={formData.arsenic}
          onChangeText={(value) => updateFormData('arsenic', value)}
          placeholder="e.g., 5.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="Lead (µg/L)"
          value={formData.lead}
          onChangeText={(value) => updateFormData('lead', value)}
          placeholder="e.g., 2.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="Sulphate (mg/L)"
          value={formData.sulphate}
          onChangeText={(value) => updateFormData('sulphate', value)}
          placeholder="e.g., 25.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="COD (mg/L)"
          value={formData.cod}
          onChangeText={(value) => updateFormData('cod', value)}
          placeholder="e.g., 10.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="Nitrate (mg/L)"
          value={formData.nitrate}
          onChangeText={(value) => updateFormData('nitrate', value)}
          placeholder="e.g., 5.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="BOD (mg/L)"
          value={formData.bod}
          onChangeText={(value) => updateFormData('bod', value)}
          placeholder="e.g., 3.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="Ammonia (mg/L)"
          value={formData.ammonia}
          onChangeText={(value) => updateFormData('ammonia', value)}
          placeholder="e.g., 0.5"
          keyboardType="decimal-pad"
        />

        {/* Environmental Parameters */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('waterQuality.environmentalParameters')}</Text>
        </View>

        <FormInput
          label="Population Density (per km²)"
          value={formData.populationDensity}
          onChangeText={(value) => updateFormData('populationDensity', value)}
          placeholder="e.g., 250"
          keyboardType="numeric"
          required
        />

        <FormInput
          label="Solar Radiation (W/m²)"
          value={formData.solarRadiation}
          onChangeText={(value) => updateFormData('solarRadiation', value)}
          placeholder="e.g., 800"
          keyboardType="numeric"
        />

        <FormInput
          label="Air Temperature (°C)"
          value={formData.airTemperature}
          onChangeText={(value) => updateFormData('airTemperature', value)}
          placeholder="e.g., 28.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="Wind Speed (km/h)"
          value={formData.windSpeed}
          onChangeText={(value) => updateFormData('windSpeed', value)}
          placeholder="e.g., 15.0"
          keyboardType="decimal-pad"
        />

        <FormInput
          label="Sanitation Coverage (%)"
          value={formData.sanitationCoverage}
          onChangeText={(value) => updateFormData('sanitationCoverage', value)}
          placeholder="e.g., 75"
          keyboardType="numeric"
        />

        {/* Categorical Parameters */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('waterQuality.assessmentLevels')}</Text>
        </View>

        <FormPicker
          label="Rainfall Level"
          selectedValue={formData.rainfallLevel}
          onValueChange={(value) => updateFormData('rainfallLevel', value)}
          items={levelOptions}
        />

        <FormPicker
          label="Humidity Level"
          selectedValue={formData.humidityLevel}
          onValueChange={(value) => updateFormData('humidityLevel', value)}
          items={levelOptions}
        />

        <FormPicker
          label="Flood Risk"
          selectedValue={formData.floodRisk}
          onValueChange={(value) => updateFormData('floodRisk', value)}
          items={levelOptions}
        />

        <FormPicker
          label="Sewage Treatment Quality"
          selectedValue={formData.sewageTreatmentQuality}
          onValueChange={(value) => updateFormData('sewageTreatmentQuality', value)}
          items={qualityOptions}
        />

        <FormPicker
          label="Waste Management Quality"
          selectedValue={formData.wasteManagementQuality}
          onValueChange={(value) => updateFormData('wasteManagementQuality', value)}
          items={qualityOptions}
        />

        <FormPicker
          label="Land Use Type"
          selectedValue={formData.landUseType}
          onValueChange={(value) => updateFormData('landUseType', value)}
          items={landUseOptions}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t('waterQuality.submit')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
          <Text style={styles.clearButtonText}>{t('waterQuality.clear')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  formContainer: {
    padding: 20,
  },
  sectionHeader: {
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  pickerWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    minHeight: 50,
  },
  picker: {
    height: 50,
    paddingHorizontal: 15,
    color: COLORS.text,
  },
  pickerIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    pointerEvents: 'none',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
})

export default WaterQuality