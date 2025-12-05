import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { notificationStyles } from '../assets/styles/notification.styles'
import { COLORS } from '../constants/colors'

const notification = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])
  
  async function fetchReports() {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching disease reports...");
      const response = await fetch(`${process.env.EXPO_PUBLIC_CLERK_FRONTEND_API}/api/disease-reports`);
      console.log("Response status:", response.status)

      if(!response.ok){
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const report = await response.json();
      console.log("Fetched reports:", report);
      setReports(report);
      
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const getSeverityStyle = (severity) => {
    const severityLower = severity?.toLowerCase();
    switch (severityLower) {
      case 'low':
      case 'mild':
        return {
          badge: notificationStyles.lowSeverity,
          text: notificationStyles.lowSeverityText
        };
      case 'medium':
      case 'moderate':
        return {
          badge: notificationStyles.mediumSeverity,
          text: notificationStyles.mediumSeverityText
        };
      case 'high':
      case 'severe':
        return {
          badge: notificationStyles.highSeverity,
          text: notificationStyles.highSeverityText
        };
      case 'critical':
      case 'very severe':
        return {
          badge: notificationStyles.criticalSeverity,
          text: notificationStyles.criticalSeverityText
        };
      default:
        return {
          badge: notificationStyles.mediumSeverity,
          text: notificationStyles.mediumSeverityText
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const renderReportCard = ({ item }) => {
    const severityStyle = getSeverityStyle(item.severity);
    
    return (
      <View style={notificationStyles.reportCard}>
        <View style={notificationStyles.reportHeader}>
          <View style={notificationStyles.patientInfo}>
            <Text style={notificationStyles.patientName}>
              {item.patient_name || item.patientName || 'Anonymous'}
            </Text>
            <Text style={notificationStyles.reportDate}>
              {formatDate(item.created_at || item.createdAt)}
            </Text>
          </View>
          <View style={[notificationStyles.severityBadge, severityStyle.badge]}>
            <Text style={[notificationStyles.severityText, severityStyle.text]}>
              {item.severity || 'Unknown'}
            </Text>
          </View>
        </View>
        
        <View style={notificationStyles.reportContent}>
          <View style={notificationStyles.symptomsContainer}>
            <Text style={notificationStyles.symptomsLabel}>Symptoms:</Text>
            <Text style={notificationStyles.symptomsText}>
              {item.symptoms || 'No symptoms reported'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={notificationStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={notificationStyles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={notificationStyles.errorContainer}>
        <View style={notificationStyles.errorIcon}>
          <Text style={{ fontSize: 24, color: COLORS.textLight }}>⚠️</Text>
        </View>
        <Text style={notificationStyles.errorTitle}>Connection Error</Text>
        <Text style={notificationStyles.errorText}>
          Unable to fetch disease reports. Please check your connection and try again.
        </Text>
        <TouchableOpacity 
          style={notificationStyles.retryButton}
          onPress={fetchReports}
        >
          <Text style={notificationStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={notificationStyles.container}>
        <View style={notificationStyles.header}>
          <Text style={notificationStyles.headerTitle}>Disease Reports</Text>
          <View style={notificationStyles.statsContainer}>
            <View style={notificationStyles.statsIcon}>
              <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: 'bold' }}>📋</Text>
            </View>
            <Text style={notificationStyles.statsText}>
              Total Reports:
              <Text style={notificationStyles.totalNumber}> 0</Text>
            </Text>
          </View>
        </View>
        
        <View style={notificationStyles.emptyState}>
          <View style={notificationStyles.emptyIcon}>
            <Text style={{ fontSize: 32, color: COLORS.textLight }}>📋</Text>
          </View>
          <Text style={notificationStyles.emptyTitle}>No Reports Yet</Text>
          <Text style={notificationStyles.emptyDescription}>
            Disease reports will appear here once they are submitted by community health workers.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={notificationStyles.container}>
      <View style={notificationStyles.header}>
        <Text style={notificationStyles.headerTitle}>Disease Reports</Text>
        <View style={notificationStyles.statsContainer}>
          <View style={notificationStyles.statsIcon}>
            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: 'bold' }}>📋</Text>
          </View>
          <Text style={notificationStyles.statsText}>
            Total Reports:
            <Text style={notificationStyles.totalNumber}> {reports.length}</Text>
          </Text>
        </View>
      </View>
      
      <FlatList
        data={reports}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderReportCard}
        style={notificationStyles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

export default notification