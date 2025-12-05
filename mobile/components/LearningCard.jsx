import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { learningCardStyles } from '../assets/styles/learn.styles';
import { useTranslation } from '../context/LanguageContext';

const LearningCard = ({ item, onPress }) => {
  const { t } = useTranslation();
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'basic':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#6A1B9A';
    }
  };

  // Get translated content based on item id
  const getTranslatedTitle = (itemId) => {
    switch(itemId) {
      case 'hygiene':
        return t('learning.categories.hygiene.title');
      case 'first-aid':
        return t('learning.categories.firstAid.title');
      case 'water-safety':
        return t('learning.categories.waterSafety.title');
      case 'disease-prevention':
        return t('learning.categories.diseasePrevention.title');
      case 'nutrition':
        return t('learning.categories.nutrition.title');
      case 'maternal-health':
        return t('learning.categories.maternalHealth.title');
      default:
        return item.title;
    }
  };

  const getTranslatedDescription = (itemId) => {
    switch(itemId) {
      case 'hygiene':
        return t('learning.categories.hygiene.description');
      case 'first-aid':
        return t('learning.categories.firstAid.description');
      case 'water-safety':
        return t('learning.categories.waterSafety.description');
      case 'disease-prevention':
        return t('learning.categories.diseasePrevention.description');
      case 'nutrition':
        return t('learning.categories.nutrition.description');
      case 'maternal-health':
        return t('learning.categories.maternalHealth.description');
      default:
        return item.description;
    }
  };

  const getTranslatedDifficulty = (difficulty) => {
    const difficultyKey = difficulty.toLowerCase();
    return t(`learning.difficulty.${difficultyKey}`);
  };

  return (
    <TouchableOpacity 
      style={learningCardStyles.container} 
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={learningCardStyles.imageContainer}>
        <Image 
          source={item.image} 
          style={learningCardStyles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={learningCardStyles.content}>
        <Text style={learningCardStyles.title} numberOfLines={2}>
          {getTranslatedTitle(item.id)}
        </Text>
        <Text style={learningCardStyles.description} numberOfLines={3}>
          {getTranslatedDescription(item.id)}
        </Text>
        
        <View style={learningCardStyles.footer}>
          <Text style={learningCardStyles.readTime}>
            {item.readTime.split(' ')[0]} {t('learning.readTime')}
          </Text>
          <View style={[
            learningCardStyles.difficulty,
            { backgroundColor: getDifficultyColor(item.difficulty) }
          ]}>
            <Text style={learningCardStyles.difficultyText}>
              {getTranslatedDifficulty(item.difficulty)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LearningCard;