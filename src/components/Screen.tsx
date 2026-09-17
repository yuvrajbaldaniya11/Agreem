import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Root container for every tab screen: owns the themed background only. */
export const Screen: React.FC<ScreenProps> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }, style]}>{children}</View>
  );
};

/**
 * Centres and caps content on very large phones so lines of text never stretch
 * uncomfortably wide, while staying edge-to-edge on ordinary handsets.
 */
export const ContentContainer: React.FC<ScreenProps> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <View style={[styles.content, { maxWidth: theme.layout.maxContentWidth }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { width: '100%', alignSelf: 'center' },
});
