import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';
import { Stack, Redirect, Tabs } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';
import { useUserRole } from '../../context/UserRoleContext';
import { useTranslation } from '../../context/LanguageContext';
import { View, Text, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { useState } from 'react';
import ProfileMenu from '../components/ProfileMenu';
import FloatingChatButton from '../../components/FloatingChatButton';

const TabsLayout = () => {
    const {isSignedIn} = useAuth()
    const { userRole, isLoading } = useUserRole();
    const { t } = useTranslation();
    const [showProfile, setShowProfile] = useState(false);
    
    // Profile button handler
    const handleProfilePress = () => {
        console.log("Profile pressed - will implement later");
        // For now, just log instead of showing modal
        // setShowProfile(true);
    };
    
    // Header right component with profile button
    const ProfileButton = () => (
        <TouchableOpacity 
            onPress={handleProfilePress}
            style={{
                marginRight: 16,
                padding: 10,
                borderRadius: 25,
                backgroundColor: COLORS.primaryLight,
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
            }}
        >
            <Ionicons 
                name="person-circle-outline" 
                size={20} 
                color={COLORS.primary} 
            />
        </TouchableOpacity>
    );
    
    if(!isSignedIn) return <Redirect href={'/(auth)/sign-in'}/>;
    
    // Show loading while determining user role
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }
    
    // Debug log to verify role detection
    console.log('TabsLayout - Current user role:', userRole);
    
  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.background} 
        translucent={false}
        hidden={true}
      />
      <Tabs
    screenOptions={
      {
        headerShown: true,
        headerTitle: t('common.appName'), // Translated title
        headerStyle: {
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          height: 70, // Reduce header height
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '700',
          color: COLORS.text,
          letterSpacing: -0.5,
        },
        headerStyle: {
          backgroundColor: COLORS.backgroundCard,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        },
        headerRight: () => <ProfileMenu />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundCard,
          borderTopColor: COLORS.borderLight,
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 8,
          height: 90,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 6.84,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
       
      }
    }
    backBehavior="initialRoute"
    initialRouteName='index'
    >
      <Tabs.Screen
      name='admin'
      options={
        userRole === 'health_official' ? {
          title: t('tabs.admin'),
          tabBarIcon :({color,size})=><MaterialIcons name="dashboard" size={size} color={color} />
        } : {
          href: null // Hide for ASHA Workers
        }
      }
      />

       {/* Map tab - Health Official only */}
      <Tabs.Screen
      name='map'
      options={
        userRole === 'health_official' ? {
          title: t('tabs.map'),
          tabBarIcon :({color,size})=><MaterialIcons name="map" size={size} color={color} />
        } : {
          href: null // Hide for ASHA Workers
        }
      }
      />
      
      {/* Learn tab - ASHA Worker only */}
      <Tabs.Screen
      name='index'
      options={
        {
          title: t('tabs.learn'),
          tabBarIcon :({color,size})=><FontAwesome5 name="heartbeat" size={size} color={color} />
        }
      }
      />
      <Tabs.Screen
      name='report'
      options={
        userRole === 'asha_worker' ?{
          title: t('tabs.report'),
          tabBarIcon :({color,size})=><Feather name="book-open" size={size} color={color} />
        }:{
          href :null
        }
      }
      />

     
      
      {/* Water Quality tab - ASHA Worker only */}
      <Tabs.Screen
      name='water_quality'
      options={
        userRole === 'asha_worker' ? {
          title: t('tabs.waterQuality'),
          tabBarIcon :({color,size})=><Feather name="droplet" size={size} color={color} />
        } : {
          href: null // Hide for Health Officials
        }
      }
      />
      
      

      

      {/* Notification tab - Health Official only */}
      
    </Tabs>
    
    {/* Floating Chat Button - Available for all users */}
    <FloatingChatButton />
    </View>
  )
}

export default TabsLayout