/**
 * Premium Japanese Aesthetics Design System
 * Comprehensive theme configuration for Japanese sword website
 */

// ============================================================================
// Color Palette
// ============================================================================

export interface ColorPalette {
  crimsonRed: string;
  darkRed: string;
  deepBlack: string;
  charcoal: string;
  gold: string;
  darkGold: string;
}

export const colors: ColorPalette = {
  crimsonRed: '#DC143C',
  darkRed: '#8B0000',
  deepBlack: '#0A0A0A',
  charcoal: '#1A1A1A',
  gold: '#FFD700',
  darkGold: '#D4AF37',
} as const;

// ============================================================================
// Typography Scale
// ============================================================================

export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export const typography: TypographyScale = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
} as const;

// ============================================================================
// Spacing System (4px increments)
// ============================================================================

export type SpacingScale = 
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export const spacing: Record<SpacingScale, string> = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  13: '3.25rem',  // 52px
  14: '3.5rem',   // 56px
  15: '3.75rem',  // 60px
  16: '4rem',     // 64px
  17: '4.25rem',  // 68px
  18: '4.5rem',   // 72px
  19: '4.75rem',  // 76px
  20: '5rem',     // 80px
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export interface BorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export const borderRadius: BorderRadius = {
  sm: '0.125rem',  // 2px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '1rem',      // 16px
} as const;

// ============================================================================
// Animation Timing Functions
// ============================================================================

export interface AnimationTiming {
  easeInOut: string;
  easeOut: string;
  easeIn: string;
}

export const animationTiming: AnimationTiming = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// ============================================================================
// Z-Index Scale
// ============================================================================

export interface ZIndexScale {
  base: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
}

export const zIndex: ZIndexScale = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// ============================================================================
// Theme Configuration Interface
// ============================================================================

export interface ThemeConfig {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: Record<SpacingScale, string>;
  borderRadius: BorderRadius;
  animationTiming: AnimationTiming;
  zIndex: ZIndexScale;
}

export const theme: ThemeConfig = {
  colors,
  typography,
  spacing,
  borderRadius,
  animationTiming,
  zIndex,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Re-export cn utility function for className merging
 * Combines clsx and tailwind-merge for optimal class merging
 */
export { cn } from './utils';

// ============================================================================
// Export Theme
// ============================================================================

export default theme;

