import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';
import { IconButton } from './IconButton';

interface InfoRowProps {
  icon: IconName;
  label: string;
  value: string;
  muted?: boolean;
  action?: { icon: IconName; label: string; onPress: () => void };
  isLast?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, muted, action, isLast }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          paddingVertical: theme.spacing.sm,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.divider,
        },
      ]}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: theme.colors.input, borderRadius: theme.radius.small },
        ]}>
        <Icon name={icon} size={17} color={theme.colors.textSecondary} />
      </View>
      {/* Grouped so the label and value are read as one phrase, while the
          trailing action stays a separate, focusable element. */}
      <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.text}>
        <AppText variant="bodySM" color="textMuted">
          {label}
        </AppText>
        <AppText
          variant="title"
          color={muted ? 'textMuted' : 'textPrimary'}
          numberOfLines={2}
          style={styles.value}>
          {value}
        </AppText>
      </View>
      {action ? (
        <IconButton icon={action.icon} label={action.label} onPress={action.onPress} size={17} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, marginLeft: 12, marginRight: 8 },
  value: { marginTop: 1 },
});
