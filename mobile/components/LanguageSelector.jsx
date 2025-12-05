import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from '../context/LanguageContext'

const { width, height } = Dimensions.get('window')

export default function LanguageSelector({ visible, onClose }) {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useTranslation()

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode)
    onClose()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('language.selectLanguage')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.languageList}>
            {availableLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  currentLanguage === language.code && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    currentLanguage === language.code && styles.selectedText
                  ]}>
                    {language.native}
                  </Text>
                  <Text style={[
                    styles.languageEnglishName,
                    currentLanguage === language.code && styles.selectedSubText
                  ]}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.85,
    maxHeight: height * 0.6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  closeButton: {
    padding: 5
  },
  languageList: {
    maxHeight: height * 0.4
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  selectedLanguage: {
    backgroundColor: '#f0f8ff'
  },
  languageInfo: {
    flex: 1
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4
  },
  languageEnglishName: {
    fontSize: 14,
    color: '#666'
  },
  selectedText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  selectedSubText: {
    color: '#4CAF50'
  }
})