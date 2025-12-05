import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { learnStyles } from '../../../assets/styles/learn.styles';
import GlobalStyles from '../../../constants/globalStyles';
import { COLORS } from '../../../constants/colors';
import { learningData } from '../../../data/learningData';
import LearningCard from '../../../components/LearningCard';
import { useTranslation } from '../../../context/LanguageContext';

const { width } = Dimensions.get('window');

const Learn = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleCardPress = (item) => {
    router.push({
      pathname: '/learning-detail',
      params: { 
        id: item.id,
        title: item.title 
      }
    });
  };

  // const handleFeaturedPress = () => {
  //   router.push({
  //     pathname: '/learning-detail',
  //     params: { 
  //       id: 'featured-1',
  //       title: learningData.featured.title 
  //     }
  //   });
  // };

  const renderCategoriesGrid = () => {
    const categories = learningData.categories;
    const rows = [];
    
    for (let i = 0; i < categories.length; i += 2) {
      const row = categories.slice(i, i + 2);
      rows.push(
        <View key={i} style={learnStyles.row}>
          {row.map((item) => (
            <LearningCard
              key={item.id}
              item={item}
              onPress={handleCardPress}
            />
          ))}
          {row.length === 1 && <View style={{ width: (width - 48) / 2 }} />}
        </View>
      );
    }
    
    return rows;
  };

  return (
    <View style={[GlobalStyles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView 
        style={GlobalStyles.container}
        contentContainerStyle={[learnStyles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[learnStyles.headerSection, { paddingHorizontal: 20, paddingTop: 20 }]}>
          <Text style={[GlobalStyles.title, { textAlign: 'center' }]}>
            {t('learning.headerTitle')}
          </Text>
        </View>

        {/* Featured Card */}
        <View style={learnStyles.featuredSection}>
          <TouchableOpacity 
            style={learnStyles.featuredCard}
            // onPress={handleFeaturedPress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={learningData.featured.gradient}
              style={learnStyles.featuredGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={learnStyles.featuredBadge}>
                <Text style={learnStyles.featuredBadgeText}>
                  {t('learning.featured.category')}
                </Text>
              </View>
              
              <View style={learnStyles.featuredContent}>
                <Text style={learnStyles.featuredTitle}>
                  {t('learning.featured.title')}
                </Text>
                <Text style={learnStyles.featuredDescription}>
                  {t('learning.featured.description')}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={learnStyles.categoriesSection}>
          <Text style={learnStyles.sectionTitle}>{t('learning.sectionTitle')}</Text>
          <View style={learnStyles.categoriesGrid}>
            {renderCategoriesGrid()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Learn;
