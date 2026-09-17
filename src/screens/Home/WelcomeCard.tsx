import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { PressableScale } from '../../components/PressableScale';
import { findCountry } from '../../constants/countries';
import { useSelectedPhoto } from '../../hooks/useSelectedPhoto';
import { useProfile } from '../../providers/ProfileProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { ProfilePhotoSheet } from './ProfilePhotoSheet';

const greetingFor = (hour: number): string => {
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

const initialsFor = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'A';

export const WelcomeCard: React.FC = () => {
  const theme = useTheme();
  const { profile } = useProfile();
  const photo = useSelectedPhoto();
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);

  const greeting = greetingFor(new Date().getHours());
  const country = findCountry(profile.countryCode);
  const hasName = profile.name.trim().length > 0;

  const subtitle = hasName
    ? [profile.email, country ? `${country.flag} ${country.name}` : null].filter(Boolean).join('  ·  ')
    : 'Add your details in Settings to personalise this dashboard.';

  return (
    <Card style={[styles.hero, { backgroundColor: theme.colors.primarySoft }]}>
      <View style={styles.row}>
        <PressableScale
          onPress={() => setPhotoSheetOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={photo.photo ? 'Change profile photo' : 'Add profile photo'}
          style={styles.avatarTap}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.primary, borderRadius: theme.radius.medium },
            ]}>
            {photo.photo ? (
              <Image
                source={{ uri: photo.photo.uri }}
                style={[styles.avatarImage, { borderRadius: theme.radius.medium }]}
                onError={photo.handleBrokenImage}
              />
            ) : hasName ? (
              <AppText variant="headingMD" rawColor={theme.colors.onPrimary}>
                {initialsFor(profile.name)}
              </AppText>
            ) : (
              <Icon name="user" size={22} color={theme.colors.onPrimary} />
            )}
          </View>
          <View
            style={[
              styles.editBadge,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.primarySoft,
              },
            ]}>
            <Icon name="camera" size={11} color={theme.colors.primary} strokeWidth={2.2} />
          </View>
        </PressableScale>
        <View style={styles.text}>
          <AppText variant="bodySM" color="textSecondary">
            {greeting}
          </AppText>
          <AppText variant="headingLG" numberOfLines={1} style={styles.name}>
            {hasName ? profile.name : 'Welcome to Agreem'}
          </AppText>
        </View>
      </View>
      <AppText variant="bodySM" color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
        {subtitle}
      </AppText>

      <ProfilePhotoSheet
        visible={photoSheetOpen}
        onClose={() => setPhotoSheetOpen(false)}
        photo={photo}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  hero: { borderColor: 'transparent' },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarTap: { width: 48, height: 48 },
  avatar: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 48, height: 48 },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, marginLeft: 12 },
  name: { marginTop: 1 },
});
