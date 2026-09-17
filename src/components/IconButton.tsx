import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { Icon, IconName } from './Icon';
import { PressableScale } from './PressableScale';

interface IconButtonProps {
  icon: IconName;
  /** Required: icon-only controls carry no visible text. */
  label: string;
  onPress: () => void;
  size?: number;
  tone?: 'default' | 'primary' | 'danger';
  hint?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onPress,
  size = 20,
  tone = 'default',
  hint,
}) => {
  const theme = useTheme();

  const color =
    tone === 'primary'
      ? theme.colors.primary
      : tone === 'danger'
      ? theme.colors.error
      : theme.colors.textSecondary;

  const background =
    tone === 'primary'
      ? theme.colors.primarySoft
      : tone === 'danger'
      ? theme.colors.errorSoft
      : theme.colors.input;

  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.9}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      hitSlop={8}
      style={[
        styles.button,
        {
          width: theme.layout.minTouchTarget,
          height: theme.layout.minTouchTarget,
          borderRadius: theme.radius.pill,
          backgroundColor: background,
        },
      ]}>
      <Icon name={icon} size={size} color={color} />
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center' },
});
