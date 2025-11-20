/**
 * Centralized color palette for the Plant App
 *
 * Usage:
 * import { Colors } from '@/constants';
 * backgroundColor: Colors.primary
 */

export const Colors = {
  // Primary palette
  primary: '#84a98c',        // Main green - used for primary actions, highlights
  primaryDark: '#52796f',    // Darker green - used for accents, active states
  darkText: '#2f3e46',       // Dark charcoal - used for text, icons
  lightBackground: '#cad2c5', // Light sage - used for backgrounds, cards

  // Semantic colors
  background: '#ffffff',      // White background
  error: '#d32f2f',          // Error states
  success: '#84a98c',        // Success states (uses primary)

  // Opacity variants (for overlays, shadows)
  primaryOpacity: 'rgba(132, 169, 140, 0.1)',
  darkTextOpacity: 'rgba(47, 62, 70, 0.6)',
} as const;
