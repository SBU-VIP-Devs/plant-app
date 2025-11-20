/**
 * Centralized typography system for the Plant App
 *
 * Usage:
 * import { Typography, FontSizes, FontFamily } from '@/constants';
 * fontSize: FontSizes.large
 */

export const FontFamily = {
  regular: 'Quicksand-Regular',
  medium: 'Quicksand-Medium',
  bold: 'Quicksand-Bold',
} as const;

export const FontSizes = {
  small: 13,
  body: 15,
  medium: 16,
  subtitle: 17,
  large: 18,
  title: 24,
  heading: 30,
} as const;

// Pre-defined text styles for common use cases
export const Typography = {
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.heading,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.title,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.subtitle,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.body,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.body,
  },
  bodyBold: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.body,
  },
  small: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.small,
  },
} as const;
