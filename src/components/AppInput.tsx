import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';
import { PressableScale } from './PressableScale';

interface BaseProps {
  label: string;
  error?: string;
  helper?: string;
  leadingIcon?: IconName;
  disabled?: boolean;
}

interface AppInputProps extends BaseProps, Omit<TextInputProps, 'style' | 'editable'> {}

/** Field states: default / focused / filled / error / disabled. */
const useFieldAnimation = (active: boolean) => {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 160,
      // Border and background colours cannot be driven natively.
      useNativeDriver: false,
    }).start();
  }, [active, progress]);
  return progress;
};

export const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ label, error, helper, leadingIcon, disabled, onFocus, onBlur, value, ...rest }, ref) => {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);
    const progress = useFieldAnimation(focused && !error);

    const borderColor = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.border, theme.colors.primary],
    });
    const backgroundColor = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.input, theme.colors.inputFocused],
    });

    const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
      event => {
        setFocused(true);
        onFocus?.(event);
      },
      [onFocus],
    );
    const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
      event => {
        setFocused(false);
        onBlur?.(event);
      },
      [onBlur],
    );

    const iconColor = error
      ? theme.colors.error
      : focused
      ? theme.colors.primary
      : theme.colors.textMuted;

    return (
      <View style={styles.wrapper}>
        <AppText variant="caption" color={disabled ? 'disabledText' : 'textSecondary'}>
          {label}
        </AppText>
        <Animated.View
          style={[
            styles.field,
            {
              borderRadius: theme.radius.medium,
              borderColor: error ? theme.colors.error : borderColor,
              backgroundColor: disabled ? theme.colors.disabled : backgroundColor,
              marginTop: theme.spacing.xs,
              paddingHorizontal: theme.spacing.sm,
              minHeight: theme.layout.minTouchTarget + 8,
            },
          ]}>
          {leadingIcon ? (
            <Icon name={leadingIcon} size={18} color={iconColor} />
          ) : null}
          <TextInput
            ref={ref}
            value={value}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={theme.colors.textMuted}
            selectionColor={theme.colors.primary}
            accessibilityLabel={label}
            maxFontSizeMultiplier={1.4}
            style={[
              theme.typography.bodyMD,
              styles.input,
              {
                color: disabled ? theme.colors.disabledText : theme.colors.textPrimary,
                marginLeft: leadingIcon ? theme.spacing.xs : 0,
              },
            ]}
            {...rest}
          />
        </Animated.View>
        <FieldMessage error={error} helper={helper} />
      </View>
    );
  },
);

AppInput.displayName = 'AppInput';

interface SelectFieldProps extends BaseProps {
  value?: string | null;
  placeholder: string;
  onPress: () => void;
  /** Rendered before the value — used for the country flag. */
  prefix?: string;
  accessibilityHint?: string;
}

/**
 * Same visual language as AppInput, but opens a picker instead of a keyboard.
 * Keeping it here guarantees the two never drift apart.
 */
export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder,
  onPress,
  error,
  helper,
  leadingIcon,
  disabled,
  prefix,
  accessibilityHint,
}) => {
  const theme = useTheme();
  const hasValue = Boolean(value);

  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" color={disabled ? 'disabledText' : 'textSecondary'}>
        {label}
      </AppText>
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        activeScale={0.985}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${hasValue ? value : placeholder}`}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        style={[
          styles.field,
          {
            borderRadius: theme.radius.medium,
            borderColor: error ? theme.colors.error : theme.colors.border,
            backgroundColor: disabled ? theme.colors.disabled : theme.colors.input,
            marginTop: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            minHeight: theme.layout.minTouchTarget + 8,
          },
        ]}>
        {leadingIcon ? (
          <Icon
            name={leadingIcon}
            size={18}
            color={error ? theme.colors.error : theme.colors.textMuted}
          />
        ) : null}
        {prefix ? <AppText variant="bodyLG" style={styles.prefix}>{prefix}</AppText> : null}
        <AppText
          variant="bodyMD"
          color={disabled ? 'disabledText' : hasValue ? 'textPrimary' : 'textMuted'}
          numberOfLines={1}
          style={[styles.selectValue, { marginLeft: leadingIcon || prefix ? theme.spacing.xs : 0 }]}>
          {hasValue ? value : placeholder}
        </AppText>
        <Icon name="chevronDown" size={18} color={theme.colors.textMuted} />
      </PressableScale>
      <FieldMessage error={error} helper={helper} />
    </View>
  );
};

const FieldMessage: React.FC<{ error?: string; helper?: string }> = ({ error, helper }) => {
  const theme = useTheme();
  if (!error && !helper) {
    return null;
  }
  return (
    <View style={[styles.message, { marginTop: theme.spacing.xxs }]}>
      {error ? <Icon name="alert" size={13} color={theme.colors.error} strokeWidth={2} /> : null}
      <AppText
        variant="bodySM"
        color={error ? 'error' : 'textMuted'}
        style={error ? styles.messageText : undefined}>
        {error ?? helper}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  field: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    // Android adds its own padding that breaks vertical centering.
    textAlignVertical: 'center',
  },
  selectValue: { flex: 1 },
  prefix: { marginRight: 2 },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: { marginLeft: 6, flex: 1 },
});
