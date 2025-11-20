/**
 * Centralized spacing system for the Plant App
 *
 * Usage:
 * import { Spacing, BorderRadius } from '@/constants';
 * padding: Spacing.medium
 */

export const Spacing = {
  xs: 8,
  small: 10,
  medium: 12,
  base: 15,
  large: 17,
  xl: 20,
  xxl: 30,
} as const;

export const BorderRadius = {
  small: 10,
  medium: 15,
  large: 20,
  xl: 30,
} as const;
