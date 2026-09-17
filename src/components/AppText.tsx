import React, { memo } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { TypographyVariant } from '../theme';
import { ColorPalette } from '../theme/colors';

type ColorToken = keyof Pick<
  ColorPalette,
  | 'textPrimary'
  | 'textSecondary'
  | 'textMuted'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'onPrimary'
  | 'disabledText'
>;

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorToken;
  /** Escape hatch for one-off colours that are already theme-derived (e.g. avatar accents). */
  rawColor?: string;
  center?: boolean;
}

/**
 * Font scaling stays on for accessibility, but large display type is capped so
 * headings cannot push buttons or cards off screen at the biggest OS settings.
 */
const MAX_MULTIPLIER: Partial<Record<TypographyVariant, number>> = {
  display: 1.25,
  headingXL: 1.3,
  headingLG: 1.35,
  headingMD: 1.4,
  button: 1.3,
};

const AppTextComponent: React.FC<AppTextProps> = ({
  variant = 'bodyMD',
  color = 'textPrimary',
  rawColor,
  center,
  style,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Text
      maxFontSizeMultiplier={MAX_MULTIPLIER[variant] ?? 1.6}
      {...rest}
      style={[
        theme.typography[variant],
        { color: rawColor ?? theme.colors[color] },
        center && styles.center,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});

export const AppText = memo(AppTextComponent);
