import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, DimensionValue, Easing, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * One looping value is created per skeleton *group* and shared by every bar, so
 * a six-row placeholder list runs a single animation rather than eighteen.
 */
export const useShimmer = (): Animated.Value => {
  const progress = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, reduceMotion]);

  return progress;
};

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  progress: Animated.Value;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, progress, radius, style }) => {
  const theme = useTheme();
  const opacity = useMemo(
    () => progress.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
    [progress],
  );

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          opacity,
          borderRadius: radius ?? theme.radius.small,
          backgroundColor: theme.colors.skeleton,
        },
        style,
      ]}
    />
  );
};
