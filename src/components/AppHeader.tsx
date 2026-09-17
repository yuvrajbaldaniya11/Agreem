import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../providers/ThemeProvider';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { IconName } from './Icon';

const logo = require('../assets/images/logo.png');
/** Intrinsic size of the supplied wordmark, used to keep its aspect ratio exact. */
const LOGO_ASPECT = 400 / 79;

export interface HeaderAction {
  icon: IconName;
  label: string;
  onPress: () => void;
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  action?: HeaderAction;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle, showLogo, action }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="header"
      style={[
        styles.container,
        {
          paddingTop: insets.top + theme.spacing.xs,
          paddingBottom: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.divider,
        },
      ]}>
      <View style={styles.row}>
        <View style={styles.titleGroup}>
          {showLogo ? (
            <Image
              source={logo}
              accessibilityRole="image"
              accessibilityLabel="Agreem Technologies"
              resizeMode="contain"
              style={[styles.logo, { aspectRatio: LOGO_ASPECT }]}
            />
          ) : (
            <AppText variant="headingLG" numberOfLines={1}>
              {title}
            </AppText>
          )}
          {subtitle ? (
            <AppText variant="bodySM" color="textMuted" numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {action ? (
          <IconButton icon={action.icon} label={action.label} onPress={action.onPress} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderBottomWidth: StyleSheet.hairlineWidth },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: { flex: 1, marginRight: 12 },
  logo: { height: 26, width: undefined },
  subtitle: { marginTop: 2 },
});
