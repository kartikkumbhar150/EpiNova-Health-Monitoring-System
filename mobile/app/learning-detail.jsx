import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { learningDetailStyles } from '../assets/styles/learn.styles';
import { getLearningById } from '../data/learningData';
import { useTranslation } from '../context/LanguageContext';

const LearningDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const learningItem = getLearningById(id);

  if (!learningItem) {
    return (
      <View style={learningDetailStyles.container}>
        <Text>{t('learning.contentNotFound')}</Text>
      </View>
    );
  }

  const renderContent = () => {
    if (id === 'featured-1') {
      return (
        <View style={learningDetailStyles.contentSection}>
          <Text style={learningDetailStyles.readTime}>
            {t('learning.featured.readTime')}
          </Text>
          <Text style={learningDetailStyles.introductionText}>
            {t('learning.featured.introduction')}
          </Text>
          <Text style={learningDetailStyles.paragraph}>
            {t('learning.featured.mission')}
          </Text>

          <Text style={learningDetailStyles.sectionTitle}>{t('learning.whatYouLearn')}</Text>
          {[
            t('learning.featured.topics.hygiene'),
            t('learning.featured.topics.firstAid'),
            t('learning.featured.topics.safeWater'),
            t('learning.featured.topics.nutrition'),
            t('learning.featured.topics.maternal'),
            t('learning.featured.topics.diseases'),
          ].map((item, index) => (
            <View key={index} style={learningDetailStyles.listItem}>
              <View style={learningDetailStyles.bullet} />
              <Text style={learningDetailStyles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <View style={learningDetailStyles.contentSection}>
        <Text style={learningDetailStyles.readTime}>
          {t(`learning.${id}.readTime`)}
        </Text>

        <Text style={learningDetailStyles.introductionText}>
          {t(`learning.${id}.content.introduction`)}
        </Text>

        {/* Render sections based on the learning item ID */}
        {id === 'hygiene' && (
          <>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.hygiene.content.sections.handHygiene.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.hygiene.content.sections.handHygiene.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.hygiene.content.sections.foodSafety.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.hygiene.content.sections.foodSafety.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.hygiene.content.sections.personalCleanliness.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.hygiene.content.sections.personalCleanliness.content')}
            </Text>
          </>
        )}

        {id === 'first-aid' && (
          <>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.first-aid.content.sections.woundCare.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.first-aid.content.sections.woundCare.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.first-aid.content.sections.burns.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.first-aid.content.sections.burns.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.first-aid.content.sections.fever.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.first-aid.content.sections.fever.content')}
            </Text>
          </>
        )}

        {id === 'water-safety' && (
          <>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.water-safety.content.sections.purification.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.water-safety.content.sections.purification.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.water-safety.content.sections.storage.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.water-safety.content.sections.storage.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.water-safety.content.sections.protection.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.water-safety.content.sections.protection.content')}
            </Text>
          </>
        )}

        {id === 'disease-prevention' && (
          <>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.disease-prevention.content.sections.waterborne.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.disease-prevention.content.sections.waterborne.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.disease-prevention.content.sections.vectorborne.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.disease-prevention.content.sections.vectorborne.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.disease-prevention.content.sections.respiratory.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.disease-prevention.content.sections.respiratory.content')}
            </Text>
          </>
        )}

        {id === 'nutrition' && (
          <>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.nutrition.content.sections.balanced.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.nutrition.content.sections.balanced.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.nutrition.content.sections.child.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.nutrition.content.sections.child.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.nutrition.content.sections.safety.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.nutrition.content.sections.safety.content')}
            </Text>
          </>
        )}

        {id === 'maternal-health' && (
          <>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.maternal-health.content.sections.prenatal.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.maternal-health.content.sections.prenatal.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.maternal-health.content.sections.delivery.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.maternal-health.content.sections.delivery.content')}
            </Text>
            <Text style={learningDetailStyles.sectionTitle}>
              {t('learning.maternal-health.content.sections.newborn.title')}
            </Text>
            <Text style={learningDetailStyles.paragraph}>
              {t('learning.maternal-health.content.sections.newborn.content')}
            </Text>
          </>
        )}

        <Text style={learningDetailStyles.sectionTitle}>{t('learning.keyTips')}</Text>
        {/* Render key tips based on the learning item ID */}
        {[1, 2, 3, 4].map((tipIndex) => {
          const tipKey = `learning.${id}.content.keyTips.tip${tipIndex}`;
          const tipText = t(tipKey);
          
          // Only render if translation exists and is not the key itself
          if (tipText && tipText !== tipKey) {
            return (
              <View key={tipIndex} style={learningDetailStyles.listItem}>
                <View style={learningDetailStyles.bullet} />
                <Text style={learningDetailStyles.listText}>{tipText}</Text>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  return (
    <View style={learningDetailStyles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={learningDetailStyles.container}
        contentContainerStyle={learningDetailStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        {id === 'featured-1' ? (
          <LinearGradient
            colors={["#EEE7FF", "#F6F2FF", "#FFFFFF"]}
            style={learningDetailStyles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              style={learningDetailStyles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={22} color="#2A1B4A" />
            </TouchableOpacity>

            <View style={learningDetailStyles.headerContent}>
              <Text style={learningDetailStyles.category}>
                {t('learning.featured.category')}
              </Text>
              <Text style={learningDetailStyles.title}>
                {t('learning.featured.title')}
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <ImageBackground
            source={learningItem.image}
            style={learningDetailStyles.header}
            resizeMode="cover"
          >
            <TouchableOpacity
              style={learningDetailStyles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={22} color="#2A1B4A" />
            </TouchableOpacity>

            {/* Non-tinted text container for readability */}
            <View style={learningDetailStyles.headerTextContainer}>
              <View style={learningDetailStyles.headerContent}>
                <Text style={learningDetailStyles.category}>{t('learning.healthEducation')}</Text>
                <Text style={learningDetailStyles.title}>{t(`learning.${id}.title`)}</Text>
              </View>
            </View>
          </ImageBackground>
        )}

        {/* Content */}
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default LearningDetail;