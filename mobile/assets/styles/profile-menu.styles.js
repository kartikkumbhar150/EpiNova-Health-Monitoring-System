import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 8,
        minWidth: 200,
        minHeight: 350,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    menuText: {
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
        flex: 1,
    },
    languageIndicator: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    signOutText: {
        color: COLORS.tertiary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 4,
    }
});

export default styles;