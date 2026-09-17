import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';
import { PressableScale } from './PressableScale';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonState = 'idle' | 'loading' | 'success';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  state?: ButtonState;
  disabled?: boolean;
  icon?: IconName;
  fullWidth?: boolean;
  successLabel?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  state = 'idle',
  disabled = false,
  icon,
  fullWidth = true,
  successLabel = 'Saved',
  style,
  accessibilityHint,
}) => {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const isBusy = state === 'loading';
  const isSuccess = state === 'success';
  const isDisabled = disabled || isBusy;

  // The check mark pops in once, briefly, then the label takes over again.
  const successScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isSuccess) {
      successScale.setValue(0);
      return;
    }
    if (reduceMotion) {
      successScale.setValue(1);
      return;
    }
    Animated.spring(successScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [isSuccess, reduceMotion, successScale]);

  const palette = (() => {
    if (isDisabled && variant !== 'ghost') {
      return { background: theme.colors.disabled, border: theme.colors.disabled, text: theme.colors.disabledText };
    }
    switch (variant) {
      case 'secondary':
        return { background: theme.colors.primarySoft, border: 'transparent', text: theme.colors.primary };
      case 'ghost':
        return { background: 'transparent', border: theme.colors.border, text: theme.colors.textPrimary };
      case 'danger':
        return { background: theme.colors.errorSoft, border: 'transparent', text: theme.colors.error };
      default:
        return {
          // A darker fill on press reads as a real button, not just a scale.
          background: pressed ? theme.colors.primaryPressed : theme.colors.primary,
          border: 'transparent',
          text: theme.colors.onPrimary,
        };
    }
  })();

  const background = isSuccess ? theme.colors.success : palette.background;
  const foreground = isSuccess ? theme.colors.onSuccess : palette.text;

  return (
    <PressableScale
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={isSuccess ? successLabel : label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: isBusy }}
      style={[
        styles.button,
        {
          backgroundColor: background,
          borderColor: isSuccess ? theme.colors.success : palette.border,
          borderRadius: theme.radius.medium,
          paddingHorizontal: theme.spacing.lg,
          minHeight: theme.layout.minTouchTarget + 6,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        variant === 'primary' && !isDisabled && theme.elevation.small,
        style,
      ]}>
      <View style={styles.content}>
        {isBusy ? (
          <ActivityIndicator color={foreground} size="small" />
        ) : isSuccess ? (
          <Animated.View style={[styles.row, { transform: [{ scale: successScale }] }]}>
            <Icon name="check" size={18} color={foreground} strokeWidth={2.4} />
            <AppText variant="button" rawColor={foreground} style={styles.label}>
              {successLabel}
            </AppText>
          </Animated.View>
        ) : (
          <View style={styles.row}>
            {icon ? <Icon name={icon} size={18} color={foreground} /> : null}
            <AppText
              variant="button"
              rawColor={foreground}
              numberOfLines={1}
              style={icon ? styles.label : undefined}>
              {label}
            </AppText>
          </View>
        )}
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginLeft: 8 },
});
