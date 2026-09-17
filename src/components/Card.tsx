import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, padded = true, elevated = true }) => {
  const theme = useTheme();

  return (
    // The shadow (elevation) and the rounded surface are split across two
    // Views on purpose: Android derives an elevated View's shadow outline
    // from its own corner radius, and that outline goes stale (leaving a
    // rectangular ghost) whenever the surface's content resizes after mount
    // (e.g. a skeleton swapping for real data, or a custom font loading in).
    // A plain rectangular wrapper carries the shadow so its outline never
    // needs to track a rounded, resizing child.
    <View style={elevated ? theme.elevation.small : undefined}>
      <View
        style={[
          {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.large,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: padded ? theme.spacing.md : 0,
            overflow: 'hidden',
          },
          style,
        ]}>
        {children}
      </View>
    </View>
  );
};
