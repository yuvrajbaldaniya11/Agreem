import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { Icon, IconName } from '../../components/Icon';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../providers/ThemeProvider';
import { useThemePreference } from '../../providers/ThemeProvider';
import { ThemePreference } from '../../theme';
import { haptics } from '../../utils/haptics';

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: IconName }> = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'smartphone' },
];

export const ThemeSelector: React.FC = () => {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();
  const reduceMotion = useReducedMotion();

  const [trackWidth, setTrackWidth] = useState(0);
  const index = Math.max(0, OPTIONS.findIndex(option => option.value === preference));
  const position = useRef(new Animated.Value(index)).current;

  useEffect(() => {
    if (reduceMotion) {
      position.setValue(index);
      return;
    }
    Animated.spring(position, {
      toValue: index,
      useNativeDriver: true,
      speed: 18,
      bounciness: 3,
    }).start();
  }, [index, position, reduceMotion]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const segmentWidth = trackWidth > 0 ? trackWidth / OPTIONS.length : 0;

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Appearance"
      onLayout={onLayout}
      style={[
        styles.track,
        { backgroundColor: theme.colors.input, borderRadius: theme.radius.medium },
      ]}>
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.indicator,
            theme.elevation.small,
            {
              width: segmentWidth - 8,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.medium - 4,
              transform: [
                {
                  translateX: position.interpolate({
                    inputRange: [0, OPTIONS.length - 1],
                    outputRange: [0, segmentWidth * (OPTIONS.length - 1)],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}

      {OPTIONS.map(option => {
        const selected = option.value === preference;
        const color = selected ? theme.colors.primary : theme.colors.textSecondary;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              if (!selected) {
                haptics.selection();
                setPreference(option.value);
              }
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label} appearance`}
            style={[styles.segment, { minHeight: theme.layout.minTouchTarget - 6 }]}>
            <Icon name={option.icon} size={16} color={color} strokeWidth={selected ? 2.1 : 1.8} />
            <AppText variant="caption" rawColor={color} maxFontSizeMultiplier={1.2} style={styles.label}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: { flexDirection: 'row', position: 'relative', padding: 4 },
  indicator: { position: 'absolute', top: 4, bottom: 4, left: 4 },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginLeft: 6 },
});
