import { ViewStyle } from 'react-native';
import { ColorPalette, darkColors, lightColors } from './colors';
import { createTypography, Typography } from './typography';
import { duration, layout, radius, spacing } from './tokens';

export type ThemeMode = 'light' | 'dark';
/** What the user picked. 'system' follows the OS appearance. */
export type ThemePreference = ThemeMode | 'system';

export interface Elevation {
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
}

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
  typography: Typography;
  spacing: typeof spacing;
  radius: typeof radius;
  layout: typeof layout;
  duration: typeof duration;
  elevation: Elevation;
}

const createElevation = (colors: ColorPalette, mode: ThemeMode): Elevation => {
  // Shadows read as noise on dark surfaces, so dark mode leans on surface
  // contrast and only keeps a trace of depth.
  const opacity = mode === 'light' ? 1 : 0.6;
  return {
    small: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.06 * opacity,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: mode === 'light' ? 2 : 0,
    },
    medium: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.09 * opacity,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: mode === 'light' ? 4 : 0,
    },
    large: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.14 * opacity,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 12 },
      elevation: mode === 'light' ? 8 : 0,
    },
  };
};

export const createTheme = (mode: ThemeMode, shortestSide: number): Theme => {
  const colors = mode === 'light' ? lightColors : darkColors;
  return {
    mode,
    colors,
    typography: createTypography(shortestSide),
    spacing,
    radius,
    layout,
    duration,
    elevation: createElevation(colors, mode),
  };
};

export * from './colors';
export * from './tokens';
export * from './typography';
