import React, { useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { ContentContainer, Screen } from '../../components/Screen';
import { AppHeader } from '../../components/AppHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { useDeviceDetails } from '../../hooks/useDeviceDetails';
import { useTheme, useThemePreference } from '../../providers/ThemeProvider';
import { DeviceInfoCard } from './DeviceInfoCard';
import { WelcomeCard } from './WelcomeCard';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const device = useDeviceDetails();
  const { setPreference } = useThemePreference();

  // A quick toggle here always lands on an explicit choice; the three-way
  // Light/Dark/System picker stays in Settings for anyone who wants "System".
  const toggleTheme = useCallback(() => {
    setPreference(theme.mode === 'light' ? 'dark' : 'light');
  }, [setPreference, theme.mode]);

  // Tapping the already-active Home tab scrolls back to the top.
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  return (
    <Screen>
      <AppHeader
        title="Agreem"
        showLogo
        action={{
          icon: theme.mode === 'light' ? 'moon' : 'sun',
          label: theme.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
          onPress: toggleTheme,
        }}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <ContentContainer>
          <WelcomeCard />

          <View style={{ marginTop: theme.spacing.xl }}>
            <SectionHeader title="Device information" caption="Read directly from this device" />
            <DeviceInfoCard
              consent={device.consent}
              status={device.status}
              details={device.details}
              onAllow={device.allow}
              onRetry={device.retry}
            />
          </View>
        </ContentContainer>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
});
