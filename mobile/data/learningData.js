export const learningData = {
  featured: {
    id: "featured-1",
    title: "Empower Your Community with Knowledge",
    description: "Access vital information on hygiene, disease prevention, and safe water practices tailored for rural living. Stay informed, stay healthy.",
    category: "Health Education",
    readTime: "5 min read",
    gradient: ["#6A1B9A", "#8E24AA"],
  },
  
  categories: [
    {
      id: "hygiene",
      title: "Basic Hygiene for Health",
      description: "Simple practices like handwashing and food safety",
      image: require("../assets/images/hand-wash.jpg"),
      readTime: "5 min read",
      difficulty: "Basic",
      color: "#4CAF50",
      content: {
        introduction: "Proper hygiene is the foundation of good health and disease prevention in rural communities.",
        sections: [
          {
            title: "Hand Hygiene",
            content: "Wash your hands frequently with soap and clean water for at least 20 seconds, especially before eating, after using the toilet, and after handling animals or waste."
          },
          {
            title: "Food Safety",
            content: "Keep food covered, cook thoroughly, and store leftovers properly. Wash fruits and vegetables before consumption."
          },
          {
            title: "Personal Cleanliness",
            content: "Bathe regularly, keep nails trimmed and clean, brush teeth twice daily, and wear clean clothes."
          }
        ],
        keyTips: [
          "Use soap and clean water for handwashing",
          "Cover food to protect from flies and contamination",
          "Boil water if you're unsure about its safety",
          "Keep living areas clean and well-ventilated"
        ]
      }
    },
    {
      id: "first-aid",
      title: "Essential First Aid Skills",
      description: "A quick guide to basic first aid techniques for emergencies",
      image: require("../assets/images/first-aid.jpg"),
      readTime: "6 min read",
      difficulty: "Basic",
      color: "#F44336",
      content: {
        introduction: "Basic first aid knowledge can save lives in emergency situations when professional medical help is not immediately available.",
        sections: [
          {
            title: "Wound Care",
            content: "Clean hands first, stop bleeding with direct pressure, clean wound gently with clean water, apply antiseptic if available, and cover with clean bandage."
          },
          {
            title: "Burns Treatment",
            content: "Cool the burn with clean, cool water for 10-15 minutes. Do not use ice. Remove jewelry before swelling occurs. Cover with clean, dry cloth."
          },
          {
            title: "Fever Management",
            content: "Give plenty of fluids, use cool compresses on forehead, remove excess clothing, and seek medical help if fever persists or exceeds 103°F (39.4°C)."
          }
        ],
        keyTips: [
          "Always clean your hands before providing first aid",
          "Call for professional medical help when possible",
          "Keep a basic first aid kit readily available",
          "Know when to seek immediate medical attention"
        ]
      }
    },
    {
      id: "water-safety",
      title: "Ensuring Safe Drinking Water",
      description: "Methods for purifying water and understanding local water sources",
      image: require("../assets/images/safe-water.jpg"),
      readTime: "8 min read",
      difficulty: "Basic",
      color: "#2196F3",
      content: {
        introduction: "Access to safe drinking water is essential for preventing waterborne diseases and maintaining good health.",
        sections: [
          {
            title: "Water Purification Methods",
            content: "Boil water for at least 1 minute, use water purification tablets, or employ simple filtration methods using clean cloth and sand."
          },
          {
            title: "Water Storage",
            content: "Store purified water in clean, covered containers. Clean storage containers regularly with soap and safe water."
          },
          {
            title: "Source Protection",
            content: "Protect water sources from contamination by keeping animals and waste away from wells and water bodies."
          }
        ],
        keyTips: [
          "Boiling is the most reliable method of water purification",
          "Store water in clean, covered containers",
          "Protect water sources from contamination",
          "Test water quality regularly if possible"
        ]
      }
    },
    {
      id: "disease-prevention",
      title: "Understanding Common Diseases",
      description: "Information on identifying symptoms, preventing transmission",
      image: require("../assets/images/common-diseases.jpg"),
      readTime: "7 min read",
      difficulty: "Intermediate",
      color: "#FF9800",
      content: {
        introduction: "Understanding common diseases helps in early recognition, prevention, and seeking appropriate treatment.",
        sections: [
          {
            title: "Waterborne Diseases",
            content: "Diarrhea, cholera, and typhoid spread through contaminated water. Symptoms include stomach pain, vomiting, and loose stools."
          },
          {
            title: "Vector-borne Diseases",
            content: "Malaria, dengue, and chikungunya spread through mosquito bites. Prevent by eliminating standing water and using bed nets."
          },
          {
            title: "Respiratory Infections",
            content: "Common cold, flu, and tuberculosis spread through air droplets. Cover mouth when coughing or sneezing."
          }
        ],
        keyTips: [
          "Practice good hygiene to prevent disease transmission",
          "Seek medical attention for persistent symptoms",
          "Vaccinate according to recommended schedules",
          "Report unusual disease patterns to health authorities"
        ]
      }
    },
    {
      id: "nutrition",
      title: "Healthy Eating for Families",
      description: "Tips for balanced nutrition using locally available foods",
      image: require("../assets/images/healthy-food.png"),
      readTime: "6 min read",
      difficulty: "Basic",
      color: "#4CAF50",
      content: {
        introduction: "Good nutrition supports immune function and overall health, especially important for growing children and pregnant women.",
        sections: [
          {
            title: "Balanced Diet Basics",
            content: "Include grains, vegetables, fruits, proteins (dal, eggs, meat), and dairy in daily meals. Eat a variety of colorful foods."
          },
          {
            title: "Child Nutrition",
            content: "Breastfeed exclusively for first 6 months, introduce complementary foods gradually, and ensure adequate protein for growth."
          },
          {
            title: "Food Safety",
            content: "Store food properly, cook thoroughly, consume fresh foods when possible, and maintain kitchen hygiene."
          }
        ],
        keyTips: [
          "Eat a variety of foods for complete nutrition",
          "Include iron-rich foods like green leafy vegetables",
          "Ensure children receive adequate calories for growth",
          "Practice proper food storage and preparation"
        ]
      }
    },
    {
      id: "maternal-health",
      title: "Maternal & Child Health",
      description: "Essential care during pregnancy and early childhood",
      image: require("../assets/images/maternal-child-health.png"),
      readTime: "10 min read",
      difficulty: "Intermediate",
      color: "#E91E63",
      content: {
        introduction: "Proper care during pregnancy and early childhood lays the foundation for lifelong health and development.",
        sections: [
          {
            title: "Prenatal Care",
            content: "Regular check-ups, proper nutrition, iron and folic acid supplements, and avoiding harmful substances during pregnancy."
          },
          {
            title: "Safe Delivery",
            content: "Plan for skilled birth attendance, prepare for emergency complications, and ensure clean delivery environment."
          },
          {
            title: "Newborn Care",
            content: "Immediate breastfeeding, keeping baby warm, cord care, and recognizing danger signs in newborns."
          }
        ],
        keyTips: [
          "Start prenatal care early in pregnancy",
          "Take iron and folic acid supplements as prescribed",
          "Plan for skilled birth attendance",
          "Recognize and respond to danger signs promptly"
        ]
      }
    }
  ]
};

export const getLearningById = (id) => {
  if (id === "featured-1") {
    return learningData.featured;
  }
  return learningData.categories.find(item => item.id === id);
};