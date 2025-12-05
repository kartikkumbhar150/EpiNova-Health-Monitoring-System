import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const learnStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featuredCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: 0.5,
    borderColor: COLORS.borderLight,
  },
  featuredGradient: {
    height: 200,
    justifyContent: "space-between",
    padding: 20,
  },
  featuredBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  featuredBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  featuredContent: {
    justifyContent: "flex-end",
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    lineHeight: 20,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
});

export const learningCardStyles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: COLORS.borderLight,
  },
  imageContainer: {
    height: 120,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readTime: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  difficulty: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  difficultyText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "600",
  },
});

// Dedicated light purple/violet palette for the Learning Detail screen (does not affect other screens)
const DETAIL = {
  background: "#FFFFFF", // page background
  panel: "#FFFFFF", // content surface
  white: "#FFFFFF",
  text: "#2A1B4A", // deep purple for text
  textMuted: "#6D5E8E",
  accent: "#7C4DFF", // primary accent
  accent2: "#8A2BE2", // secondary accent
  border: "#ECE3FF", // subtle lilac border
  shadow: "#000000",
};

export const learningDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DETAIL.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    height: 280,
    justifyContent: "flex-end",
    padding: 20,
  },
  seamlessGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: DETAIL.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    padding: 12,
    alignSelf: 'stretch',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(236,227,255,0.8)',
  },
  category: {
    fontSize: 14,
    color: DETAIL.textMuted,
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: DETAIL.text,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  contentSection: {
    backgroundColor: DETAIL.panel,
    marginTop: -56,
    paddingTop: 72,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: DETAIL.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderTopWidth: 1,
    borderColor: DETAIL.border,
  },
  introductionText: {
    fontSize: 17,
    color: DETAIL.text,
    lineHeight: 28,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: DETAIL.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DETAIL.border,
    fontWeight: "500",
    fontStyle: "italic",
    shadowColor: DETAIL.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  readTime: {
    fontSize: 14,
    color: DETAIL.accent,
    fontWeight: "600",
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(124,77,255,0.12)",
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(124,77,255,0.3)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: DETAIL.accent,
    marginBottom: 12,
    marginTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(124,77,255,0.25)",
    textShadowColor: "transparent",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  paragraph: {
    fontSize: 16,
    color: DETAIL.text,
    lineHeight: 26,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: DETAIL.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: DETAIL.accent2,
    borderWidth: 1,
    borderColor: DETAIL.border,
    shadowColor: DETAIL.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(124,77,255,0.08)",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DETAIL.accent2,
    marginTop: 10,
    marginRight: 16,
    shadowColor: DETAIL.accent2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: DETAIL.text,
    lineHeight: 24,
    fontWeight: "500",
  },
});