import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Language translations
import en from '../i18n/en.json'
import hi from '../i18n/hi.json'
import galo from '../i18n/galo.json'

const translations = {
  en,
  hi,
  galo
}

const LanguageContext = createContext()

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(true)

  // Load saved language on app start
  useEffect(() => {
    loadSavedLanguage()
  }, [])

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage')
      if (savedLanguage && translations[savedLanguage]) {
        setCurrentLanguage(savedLanguage)
      }
    } catch (error) {
      console.error('Error loading saved language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const changeLanguage = async (languageCode) => {
    try {
      console.log('Changing language to:', languageCode)
      if (translations[languageCode]) {
        setCurrentLanguage(languageCode)
        await AsyncStorage.setItem('selectedLanguage', languageCode)
        console.log('Language changed successfully to:', languageCode)
      } else {
        console.error('Language not supported:', languageCode)
      }
    } catch (error) {
      console.error('Error saving language:', error)
    }
  }

  // Translation function with nested key support
  const t = (key, params = {}) => {
    console.log(`Translating key: ${key} for language: ${currentLanguage}`)
    const keys = key.split('.')
    let translation = translations[currentLanguage]
    
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k]
      } else {
        translation = undefined
        break
      }
    }

    // Fallback to English if translation not found
    if (!translation) {
      console.log(`Translation not found for ${key} in ${currentLanguage}, falling back to English`)
      let fallback = translations.en
      for (const k of keys) {
        if (fallback && typeof fallback === 'object') {
          fallback = fallback[k]
        } else {
          fallback = key // Return the key itself if no translation found
          break
        }
      }
      translation = fallback
    }

    // Handle parameter substitution
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match
      })
    }

    console.log(`Translation result: ${translation}`)
    return translation || key
  }

  const getCurrentLanguageInfo = () => {
    const languageInfo = {
      en: { name: 'English', native: 'English', rtl: false },
      hi: { name: 'Hindi', native: 'हिन्दी', rtl: false },
      galo: { name: 'Galo', native: 'Galo', rtl: false }
    }
    return languageInfo[currentLanguage] || languageInfo.en
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    getCurrentLanguageInfo,
    availableLanguages: [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
      { code: 'galo', name: 'Galo', native: 'Galo' }
    ]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}