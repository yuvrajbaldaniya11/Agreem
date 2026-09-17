/**
 * Palette derived from the Agreem brand mark:
 * primary blue #027FC5, accent teal #08C9BC.
 */

export interface ColorPalette {
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  input: string;
  inputFocused: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  secondarySoft: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  divider: string;
  success: string;
  successSoft: string;
  onSuccess: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  disabled: string;
  disabledText: string;
  overlay: string;
  skeleton: string;
  shadow: string;
}

export const lightColors: ColorPalette = {
  background: '#F3F6FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  input: '#F1F4F9',
  inputFocused: '#FFFFFF',
  primary: '#027FC5',
  primaryPressed: '#01679F',
  primarySoft: '#E4F1FB',
  onPrimary: '#FFFFFF',
  secondary: '#08C9BC',
  secondarySoft: '#DFF7F4',
  textPrimary: '#0D1B2A',
  textSecondary: '#52627A',
  textMuted: '#8695AB',
  border: '#E2E8F2',
  borderStrong: '#CCD6E5',
  divider: '#EDF1F7',
  success: '#0E9A63',
  successSoft: '#E1F6EC',
  onSuccess: '#FFFFFF',
  warning: '#C87A00',
  warningSoft: '#FDF1DE',
  error: '#D33642',
  errorSoft: '#FCE8E9',
  disabled: '#E6EBF2',
  disabledText: '#A9B4C4',
  overlay: 'rgba(9, 17, 28, 0.45)',
  skeleton: '#E6EBF3',
  shadow: '#0D1B2A',
};

export const darkColors: ColorPalette = {
  background: '#0B1017',
  surface: '#121A24',
  surfaceElevated: '#18222F',
  card: '#141D28',
  input: '#1A2432',
  inputFocused: '#1F2B3B',
  primary: '#38A3E4',
  primaryPressed: '#2B87C1',
  primarySoft: '#10293A',
  onPrimary: '#04121C',
  secondary: '#2FD9CB',
  secondarySoft: '#0D2E2D',
  textPrimary: '#E9F0F8',
  textSecondary: '#A6B4C7',
  textMuted: '#71829A',
  border: '#233040',
  borderStrong: '#2E3D50',
  divider: '#1B2634',
  success: '#34CE8E',
  successSoft: '#0E2D22',
  onSuccess: '#04231A',
  warning: '#F0A93B',
  warningSoft: '#2E2413',
  error: '#FF6F78',
  errorSoft: '#33171B',
  disabled: '#232E3B',
  disabledText: '#5B6B7F',
  overlay: 'rgba(0, 0, 0, 0.62)',
  skeleton: '#1B2532',
  shadow: '#000000',
};
