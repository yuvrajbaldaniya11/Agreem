/**
 * Static design tokens shared by both themes.
 * Nothing in the app should use a raw spacing / radius number directly.
 */

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  small: 10,
  medium: 16,
  large: 24,
  pill: 999,
} as const;

/** Layout constants that keep content comfortable on very large phones. */
export const layout = {
  maxContentWidth: 560,
  headerHeight: 56,
  tabBarHeight: 62,
  minTouchTarget: 44,
} as const;

export const duration = {
  instant: 120,
  fast: 180,
  normal: 240,
  slow: 320,
} as const;

export type Spacing = typeof spacing;
export type Radius = typeof radius;
