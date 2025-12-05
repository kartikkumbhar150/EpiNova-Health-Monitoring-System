import { View, Text } from 'react-native'
import React from 'react'
import SignOutButton from '../components/SignOutButton'
import DiseaseReportForm from '../../components/DiseaseReportForm'
import { useUserRole } from '../../context/UserRoleContext'
import { useTranslation } from '../../context/LanguageContext'


const Report = () => {
  const { userRole, isLoading, isASHAWorker, isHealthOfficial } = useUserRole()
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('common.loading')}</Text>
      </View>
    )
  }

  return (
    <>
      
      <DiseaseReportForm />
      
    </>
  )
}

export default Report