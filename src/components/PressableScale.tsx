import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** How far the element shrinks while held. */
  activeScale?: number;
  children: React.ReactNode;
}

/**
 * The single press-feedback primitive used across buttons, cards and rows so
 * every tappable surface in the app responds the same way.
 */
export const PressableScale: React.FC<PressableScaleProps> = ({
  style,
  activeScale = 0.97,
  onPressIn,
  onPressOut,
  disabled,
  children,
  ...rest
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReducedMotion();

  const animateTo = useCallback(
    (value: number) => {
      if (reduceMotion) {
        scale.setValue(1);
        return;
      }
      Animated.spring(scale, {
        toValue: value,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }).start();
    },
    [reduceMotion, scale],
  );

  return (
    <Pressable
      disabled={disabled}
      onPressIn={event => {
        animateTo(activeScale);
        onPressIn?.(event);
      }}
      onPressOut={event => {
        animateTo(1);
        onPressOut?.(event);
      }}
      {...rest}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
};
