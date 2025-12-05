import { View, TouchableOpacity, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import styles from '../../assets/styles/profile-menu.styles';
import GlobalStyles from '../../constants/globalStyles';
import { COLORS } from '../../constants/colors';
import { useTranslation } from '../../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const ProfileMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const { signOut } = useAuth();
    const router = useRouter();
    const { t, getCurrentLanguageInfo } = useTranslation();

    const handleSignOut = async () => {
        try {
            await signOut();
            setShowMenu(false);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleProfilePress = () => {
        router.push("/profile");
        setShowMenu(false);
    };

    const handleNotificationPress = () => {
        router.push("/notification");
        setShowMenu(false);
    };

    const handleLanguagePress = () => {
        setShowMenu(false);
        setShowLanguageSelector(true);
    };

    return (
        <View>
            <TouchableOpacity 
                onPress={() => setShowMenu(!showMenu)}
                style={{
                    padding: 8,
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
                    size={24} 
                    color={COLORS.primary} 
                />
            </TouchableOpacity>

            <Modal
                transparent
                visible={showMenu}
                onRequestClose={() => setShowMenu(false)}
                animationType="fade"
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMenu(false)}
                >
                    <View style={styles.menuContainer}>

                        <TouchableOpacity 
                            style={styles.menuItem} 
                            onPress={handleProfilePress}
                        >
                            <Ionicons 
                                name="person-outline" 
                                size={24} 
                                color={COLORS.text} 
                            />
                            <Text style={styles.menuText}>
                                {t('profileMenu.profile')}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity 
                            style={styles.menuItem} 
                            onPress={handleNotificationPress}
                        >
                            <Ionicons 
                                name="notifications" 
                                size={24} 
                                color={COLORS.text} 
                            />
                            <Text style={styles.menuText}>
                                {t('profileMenu.notifications')}
                            </Text>
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />

                        <TouchableOpacity 
                            style={styles.menuItem} 
                            onPress={handleLanguagePress}
                        >
                            <Ionicons 
                                name="language-outline" 
                                size={24} 
                                color={COLORS.text} 
                            />
                            <Text style={styles.menuText}>
                                {t('profileMenu.changeLanguage')}
                            </Text>
                            <Text style={styles.languageIndicator}>
                                {getCurrentLanguageInfo().native}
                            </Text>
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />

                        <TouchableOpacity 
                            style={styles.menuItem} 
                            onPress={handleSignOut}
                        >
                            <Ionicons 
                                name="log-out-outline" 
                                size={24} 
                                color={COLORS.tertiary} 
                            />
                            <Text style={[styles.menuText, styles.signOutText]}>
                                {t('profileMenu.signOut')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <LanguageSelector 
                visible={showLanguageSelector}
                onClose={() => setShowLanguageSelector(false)}
            />
        </View>
    );
};

export default ProfileMenu;