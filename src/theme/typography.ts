import { TextStyle } from 'react-native';

/**
 * Font family names match the asset file names bundled in
 * android/app/src/main/assets/fonts (and the iOS PostScript names).
 */
export const fontFamily = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;

export type TypographyVariant =
  | 'display'
  | 'headingXL'
  | 'headingLG'
  | 'headingMD'
  | 'title'
  | 'bodyLG'
  | 'bodyMD'
  | 'bodySM'
  | 'caption'
  | 'button';

export type Typography = Record<TypographyVariant, TextStyle>;

/** Reference width the scale was designed against (iPhone 12 / Pixel 5 class). */
const BASE_WIDTH = 375;
const MIN_FACTOR = 0.92;
const MAX_FACTOR = 1.08;

/**
 * Controlled responsive scaling: the step between the smallest and the largest
 * phone is deliberately small so the layout stays balanced instead of the type
 * ballooning on tablets-sized handsets.
 */
export const getTypeScaleFactor = (shortestSide: number): number => {
  const raw = shortestSide / BASE_WIDTH;
  return Math.min(MAX_FACTOR, Math.max(MIN_FACTOR, raw));
};

interface VariantSpec {
  family: string;
  size: number;
  /** Multiplier applied to the scaled font size. */
  lineHeight: number;
  letterSpacing?: number;
}

const specs: Record<TypographyVariant, VariantSpec> = {
  display: { family: fontFamily.bold, size: 32, lineHeight: 1.22, letterSpacing: -0.6 },
  headingXL: { family: fontFamily.bold, size: 26, lineHeight: 1.26, letterSpacing: -0.4 },
  headingLG: { family: fontFamily.bold, size: 22, lineHeight: 1.3, letterSpacing: -0.3 },
  headingMD: { family: fontFamily.semiBold, size: 18, lineHeight: 1.34, letterSpacing: -0.2 },
  title: { family: fontFamily.semiBold, size: 16, lineHeight: 1.38, letterSpacing: -0.1 },
  bodyLG: { family: fontFamily.regular, size: 16, lineHeight: 1.5 },
  bodyMD: { family: fontFamily.regular, size: 14, lineHeight: 1.5 },
  bodySM: { family: fontFamily.regular, size: 13, lineHeight: 1.46 },
  caption: { family: fontFamily.medium, size: 12, lineHeight: 1.4, letterSpacing: 0.2 },
  button: { family: fontFamily.semiBold, size: 15, lineHeight: 1.3, letterSpacing: 0.1 },
};

export const createTypography = (shortestSide: number): Typography => {
  const factor = getTypeScaleFactor(shortestSide);

  return (Object.keys(specs) as TypographyVariant[]).reduce((acc, key) => {
    const spec = specs[key];
    const fontSize = Math.round(spec.size * factor);
    acc[key] = {
      fontFamily: spec.family,
      fontSize,
      lineHeight: Math.round(fontSize * spec.lineHeight),
      letterSpacing: spec.letterSpacing,
    };
    return acc;
  }, {} as Typography);
};
