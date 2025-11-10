/**
 * TypeScript type definitions for component variants and design system
 */

import type { VariantProps } from 'class-variance-authority';

// ============================================================================
// Component Variant Types
// ============================================================================

/**
 * Button variant types
 */
export interface ButtonVariants {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

/**
 * Card variant types
 */
export interface CardVariants {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Badge variant types
 */
export interface BadgeVariants {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Input variant types
 */
export interface InputVariants {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

/**
 * Alert variant types
 */
export interface AlertVariants {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Typography variant types
 */
export interface TypographyVariants {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'accent';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract variant props from a component using class-variance-authority
 */
export type ExtractVariantProps<T extends (...args: any) => any> = VariantProps<T>;

/**
 * Size variants
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variants
 */
export type ColorVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'error' | 'warning' | 'success';

/**
 * Spacing variants
 */
export type SpacingVariant = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

// ============================================================================
// Sword Gallery Types
// ============================================================================

/**
 * Sword category types
 */
export type SwordCategory = 'katana' | 'wakizashi' | 'tanto';

/**
 * Sword interface
 */
export interface Sword {
  id: string;
  name: string;
  nameJapanese: string;
  category: SwordCategory;
  price: number;
  image: string;
  description: string;
  craftsman: string;
  era: string;
}
