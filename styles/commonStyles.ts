/**
 * Common reusable styles used throughout the Plant App
 *
 * Usage:
 * import { CommonStyles } from '@/styles';
 * <Pressable style={CommonStyles.primaryButton}>
 */

import { StyleSheet } from 'react-native';
import { Colors, Typography, FontFamily, FontSizes, Spacing, BorderRadius } from '../constants';

export const CommonStyles = StyleSheet.create({
  // Container styles
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
    padding: Spacing.base,
  },

  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: Colors.primary,
    width: '100%',
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: Spacing.base,
  },

  headerText: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: Spacing.small,
  },

  // Button styles
  primaryButton: {
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    width: '50%',
    padding: Spacing.xs,
    marginTop: Spacing.small,
  },

  accentButton: {
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryDark,
    width: '50%',
    padding: Spacing.xs,
  },

  darkButton: {
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.darkText,
    width: '50%',
    padding: Spacing.xs,
  },

  // Text styles
  darkTitle: {
    fontFamily: FontFamily.bold,
    color: Colors.darkText,
    fontSize: FontSizes.subtitle,
  },

  darkSubtitle: {
    fontFamily: FontFamily.regular,
    color: Colors.darkText,
    fontSize: FontSizes.small,
  },

  lightTitle: {
    fontFamily: FontFamily.bold,
    color: Colors.primaryDark,
    fontSize: FontSizes.subtitle,
  },

  lightSubtitle: {
    fontFamily: FontFamily.regular,
    color: Colors.primaryDark,
    fontSize: FontSizes.small,
  },

  pageHeader: {
    fontSize: FontSizes.heading,
    lineHeight: 42,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textAlign: 'left',
    color: Colors.darkText,
  },

  buttonText: {
    fontSize: FontSizes.medium,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.darkText,
  },

  descriptionText: {
    fontFamily: FontFamily.medium,
    color: Colors.darkText,
    fontSize: FontSizes.small,
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
    paddingBottom: Spacing.base,
  },

  // Input styles
  textInput: {
    marginTop: 7,
    fontSize: FontSizes.body,
    color: Colors.darkText,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.darkText,
    borderRadius: BorderRadius.small,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
  },

  // Image styles
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 200,
  },

  gardenImage: {
    width: '100%',
    height: 250,
  },

  thumbnailImage: {
    width: 300,
    height: 300,
    marginTop: Spacing.small,
    borderRadius: BorderRadius.small,
  },

  // Layout utilities
  centeredView: {
    alignItems: 'center',
  },

  rowLayout: {
    flexDirection: 'row',
  },

  columnLayout: {
    flexDirection: 'column',
  },

  // Screen-level containers
  fullScreenContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: Spacing.xl,
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },

  paddedContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: Spacing.xl,
    padding: Spacing.xl,
    width: '100%',
  },

  // List styles
  horizontalList: {
    paddingHorizontal: Spacing.small,
  },

  taskCardContainer: {
    marginRight: Spacing.base,
    width: 280,
  },

  // Task/Garden card specific
  taskCard: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.xl,
    paddingTop: Spacing.small,
    paddingBottom: Spacing.small,
  },

  // Text variants
  noContentText: {
    textAlign: 'center',
    color: Colors.darkText,
    fontSize: FontSizes.medium,
    marginVertical: Spacing.xl,
  },

  // Scrollview content
  scrollViewContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },

  // Auth/Form buttons
  authButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.small,
    elevation: 3,
    backgroundColor: Colors.primary,
    marginTop: Spacing.small,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    width: '90%',
    maxHeight: '80%',
    padding: Spacing.xl,
  },

  modalScrollContent: {
    paddingBottom: Spacing.xl,
  },

  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.title,
    color: Colors.darkText,
    marginBottom: Spacing.small,
  },

  modalSection: {
    marginTop: Spacing.base,
  },

  modalSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.subtitle,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },

  closeButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.medium,
    alignItems: 'center',
    marginTop: Spacing.base,
  },

  closeButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.medium,
    color: Colors.background,
  },
});
