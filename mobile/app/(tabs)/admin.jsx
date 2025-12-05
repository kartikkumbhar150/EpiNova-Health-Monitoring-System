import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../../constants/colors'
import GlobalStyles from '../../constants/globalStyles'
import { useTranslation } from '../../context/LanguageContext'

const AdminDashboard = () => {
  const { t } = useTranslation()
  const [dashboardData, setDashboardData] = useState({
    totalReports: 0,
    topVillages: [],
    highRiskVillages: [],
    villagesByPercentage: [],
    district: '',
    state: '',
    loading: true
  })
  const [refreshing, setRefreshing] = useState(false)

  // API Base URLs
  const BACKEND_API = process.env.EXPO_PUBLIC_CLERK_FRONTEND_API || 'http://192.168.43.175:3000'
  const ML_API = process.env.EXPO_PUBLIC_ML_API || 'http://192.168.43.175:5000'

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }))
      
      console.log('🔍 Fetching data from:')
      console.log('Backend API:', BACKEND_API)
      console.log('ML API:', ML_API)

      // Fetch data from multiple endpoints
      const [reportsRes, topVillagesRes, percentageRes, riskVillagesRes] = await Promise.all([
        fetch(`${BACKEND_API}/api/disease-reports`).catch(err => {
          console.log('❌ Backend API error:', err)
          return { ok: false }
        }),
        fetch(`${ML_API}/api/v1/top-villages?limit=5`).catch(err => {
          console.log('❌ Top villages API error:', err)
          return { ok: false }
        }),
        fetch(`${ML_API}/api/v1/top-villages-percentage?limit=5`).catch(err => {
          console.log('❌ Percentage API error:', err)
          return { ok: false }
        }),
        fetch(`${ML_API}/api/v1/high-risk-villages`).catch(err => {
          console.log('❌ High risk villages API error:', err)
          return { ok: false }
        }),
      ])

      const newData = {
        totalReports: 0,
        topVillages: [],
        highRiskVillages: [],
        villagesByPercentage: [],
        district: '',
        state: '',
        loading: false
      }

      // Process disease reports
      if (reportsRes.ok) {
        const reports = await reportsRes.json()
        newData.totalReports = reports.length
        console.log('✅ Disease reports:', reports.length)
      }

      // Process top villages by cases
      if (topVillagesRes.ok) {
        const topVillages = await topVillagesRes.json()
        newData.topVillages = topVillages.top_villages || []
        newData.district = topVillages.district || ''
        newData.state = topVillages.state || ''
        console.log('✅ Top villages:', newData.topVillages.length)
      }

      // Process villages by percentage
      if (percentageRes.ok) {
        const percentageData = await percentageRes.json()
        newData.villagesByPercentage = percentageData.top_villages_by_percentage || []
        console.log('✅ Villages by percentage:', newData.villagesByPercentage.length)
      }

      // Process high risk villages
      if (riskVillagesRes.ok) {
        const riskData = await riskVillagesRes.json()
        newData.highRiskVillages = riskData.high_risk_villages || []
        console.log('✅ High risk villages:', newData.highRiskVillages.length, riskData.high_risk_villages)
      } else {
        console.log('❌ High risk villages API failed')
      }

      console.log('📊 Final dashboard data:', newData)
      setDashboardData(newData)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setDashboardData(prev => ({ ...prev, loading: false }))
      Alert.alert(t('common.error'), 'Failed to fetch dashboard data')
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const DataCard = ({ title, value, icon, color, subtext, onPress }) => (
    <TouchableOpacity 
      style={[GlobalStyles.card, styles.dataCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[color + '15', color + '08']}
        style={[styles.cardGradient, { borderRadius: 12 }]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <Text style={[GlobalStyles.heading, styles.cardValue]}>{value}</Text>
        </View>
        <Text style={[GlobalStyles.bodySmall, styles.cardTitle]}>{title}</Text>
        {subtext && <Text style={[GlobalStyles.caption, styles.cardSubtext]}>{subtext}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  )

  const VillageListCard = ({ title, villages, type }) => (
    <View style={styles.listCard}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>{title}</Text>
        <Feather name="map-pin" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.villageList}>
        {villages.slice(0, 3).map((village, index) => (
          <View key={index} style={styles.villageItem}>
            <View style={styles.villageInfo}>
              <Text style={styles.villageName}>
                {typeof village === 'string' ? village : village.village || village}
              </Text>
              {type === 'percentage' && village.population && (
                <Text style={styles.villagePopulation}>
                  Population: {village.population.toLocaleString()}
                </Text>
              )}
            </View>
            <View style={styles.villageMetrics}>
              {type === 'percentage' && village.percentage_affected && (
                <Text style={styles.villagePercentage}>
                  {village.percentage_affected}%
                </Text>
              )}
              {type === 'cases' && village.total_cases && (
                <Text style={styles.villageCases}>
                  {village.total_cases} cases
                </Text>
              )}
              {type === 'risk' && (
                <Text style={styles.villageRisk}>
                  High Risk
                </Text>
              )}
            </View>
          </View>
        ))}
        {villages.length > 3 && (
          <Text style={styles.moreText}>+{villages.length - 3} more villages</Text>
        )}
      </View>
    </View>
  )

  if (dashboardData.loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={[GlobalStyles.container]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 20, paddingTop: 20 }]}>
        <Text style={[GlobalStyles.title, styles.headerTitle]}>{t('admin.title')}</Text>
        <Text style={[GlobalStyles.bodySmall, styles.headerSubtitle]}>
          {dashboardData.district && dashboardData.state 
            ? `${dashboardData.district}, ${dashboardData.state}` 
            : t('admin.subtitle')}
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <View style={styles.cardRow}>
          <DataCard
            title={t('admin.totalReports')}
            value={dashboardData.totalReports}
            icon="document-text"
            color={COLORS.primary}
            subtext="Disease reports filed"
          />
          <DataCard
            title={t('admin.highRiskVillages')}
            value={dashboardData.highRiskVillages.length}
            icon="warning"
            color="#FF6B6B"
            subtext="Require immediate attention"
          />
        </View>
        
        <View style={styles.cardRow}>
          <DataCard
            title={t('admin.topAffected')}
            value={dashboardData.villagesByPercentage.length > 0 ? 
              `${dashboardData.villagesByPercentage[0]?.percentage_affected}%` : '0%'}
            icon="trending-up"
            color="#4ECDC4"
            subtext="Highest infection rate"
          />
          <DataCard
            title={t('admin.mostCases')}
            value={dashboardData.topVillages.length > 0 ? 
              dashboardData.topVillages[0]?.total_cases : 0}
            icon="bar-chart"
            color="#45B7D1"
            subtext="Total disease cases"
          />
        </View>
      </View>

      {/* Village Lists */}
      <View style={styles.listsSection}>
        <VillageListCard
          title="Villages by Case Count"
          villages={dashboardData.topVillages}
          type="cases"
        />
        
        <VillageListCard
          title="Villages by Infection Rate"
          villages={dashboardData.villagesByPercentage}
          type="percentage"
        />
        
        <VillageListCard
          title="High Risk Villages"
          villages={dashboardData.highRiskVillages}
          type="risk"
        />
      </View>

      {/* Action Buttons */}
      {/* <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="analytics" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>{t('admin.viewAnalytics')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="report" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>{t('admin.generateReport')}</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dataCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  listsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  villageList: {
    gap: 12,
  },
  villageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  villageInfo: {
    flex: 1,
  },
  villageMetrics: {
    alignItems: 'flex-end',
  },
  villageName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  villagePopulation: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  villagePercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  villageCases: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  villageRisk: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  moreText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
}

export default AdminDashboard