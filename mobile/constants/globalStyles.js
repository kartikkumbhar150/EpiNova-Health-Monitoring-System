import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const GlobalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  cardSmall: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  // Typography
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
    lineHeight: 34,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: -0.3,
    lineHeight: 28,
  },

  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: -0.2,
    lineHeight: 26,
  },

  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 22,
  },

  body: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 24,
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textLight,
    lineHeight: 16,
  },

  // Button Styles
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonSecondary: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },

  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Input Styles
  inputContainer: {
    marginVertical: 8,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  inputFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  // Section Styles
  section: {
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 20,
  },

  // Status Styles
  statusSuccess: {
    backgroundColor: COLORS.success + '15',
    borderColor: COLORS.success,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },

  statusError: {
    backgroundColor: COLORS.error + '15',
    borderColor: COLORS.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },

  statusWarning: {
    backgroundColor: COLORS.warning + '15',
    borderColor: COLORS.warning,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },

  statusInfo: {
    backgroundColor: COLORS.info + '15',
    borderColor: COLORS.info,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },

  // Layout Helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Spacing
  marginBottom8: { marginBottom: 8 },
  marginBottom12: { marginBottom: 12 },
  marginBottom16: { marginBottom: 16 },
  marginBottom20: { marginBottom: 20 },
  marginBottom24: { marginBottom: 24 },

  marginTop8: { marginTop: 8 },
  marginTop12: { marginTop: 12 },
  marginTop16: { marginTop: 16 },
  marginTop20: { marginTop: 20 },
  marginTop24: { marginTop: 24 },

  paddingHorizontal16: { paddingHorizontal: 16 },
  paddingHorizontal20: { paddingHorizontal: 20 },
  paddingVertical16: { paddingVertical: 16 },
  paddingVertical20: { paddingVertical: 20 },
});

export default GlobalStyles;