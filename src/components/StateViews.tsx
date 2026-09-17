import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

interface StateViewProps {
  icon: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  tone?: 'neutral' | 'accent' | 'error' | 'warning';
  compact?: boolean;
}

/**
 * Every empty / error / permission surface in the app renders through this one
 * component, so they share icon treatment, spacing and copy rhythm.
 */
export const StateView: React.FC<StateViewProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  tone = 'neutral',
  compact = false,
}) => {
  const theme = useTheme();

  const accent =
    tone === 'error'
      ? { fg: theme.colors.error, bg: theme.colors.errorSoft }
      : tone === 'warning'
      ? { fg: theme.colors.warning, bg: theme.colors.warningSoft }
      : tone === 'accent'
      ? { fg: theme.colors.secondary, bg: theme.colors.secondarySoft }
      : { fg: theme.colors.primary, bg: theme.colors.primarySoft };

  const badgeSize = compact ? 52 : 68;

  return (
    <View
      style={[
        styles.container,
        { paddingVertical: compact ? theme.spacing.lg : theme.spacing.xxl, paddingHorizontal: theme.spacing.lg },
      ]}>
      <View
        style={[
          styles.badge,
          { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2, backgroundColor: accent.bg },
        ]}>
        <Icon name={icon} size={compact ? 24 : 30} color={accent.fg} />
      </View>
      {/* The copy is one announcement; the buttons stay separately focusable. */}
      <View accessible accessibilityLabel={`${title}. ${message}`} style={styles.copy}>
        <AppText
          variant={compact ? 'headingMD' : 'headingLG'}
          center
          style={{ marginTop: theme.spacing.md }}>
          {title}
        </AppText>
        <AppText
          variant="bodyMD"
          color="textSecondary"
          center
          style={[styles.message, { marginTop: theme.spacing.xs }]}>
          {message}
        </AppText>
      </View>
      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          fullWidth={false}
          variant="primary"
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : null}
      {secondaryActionLabel && onSecondaryAction ? (
        <AppButton
          label={secondaryActionLabel}
          onPress={onSecondaryAction}
          fullWidth={false}
          variant="ghost"
          style={{ marginTop: theme.spacing.xs }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  copy: { alignItems: 'center' },
  badge: { alignItems: 'center', justifyContent: 'center' },
  message: { maxWidth: 320 },
});
