import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { AppInput, SelectField } from '../../components/AppInput';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { ContentContainer, Screen } from '../../components/Screen';
import { SectionHeader } from '../../components/SectionHeader';
import { findCountry } from '../../constants/countries';
import { useProfileForm } from '../../hooks/useProfileForm';
import { useLeaveGuard } from '../../providers/LeaveGuardProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { Country } from '../../types';
import { BirthdatePicker } from './BirthdatePicker';
import { CountrySheet } from './CountrySheet';
import { ThemeSelector } from './ThemeSelector';

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const form = useProfileForm();
  const { setGuard } = useLeaveGuard();

  const [countryVisible, setCountryVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const emailRef = useRef<TextInput>(null);
  useScrollToTop(scrollRef);

  const confirmDiscard = useCallback(
    (proceed: () => void) => {
      Alert.alert(
        'Unsaved changes',
        'You have edits that have not been saved yet. Do you want to leave without saving?',
        [
          { text: 'Continue editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              form.discard();
              proceed();
            },
          },
        ],
      );
    },
    [form],
  );

  // Register the guard only while there is something to lose.
  useEffect(() => {
    setGuard(form.isDirty ? confirmDiscard : null);
    return () => setGuard(null);
  }, [form.isDirty, confirmDiscard, setGuard]);

  // Hardware back leaves the Settings tab; the same confirmation applies.
  useFocusEffect(
    useCallback(() => {
      if (!form.isDirty) {
        return undefined;
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        confirmDiscard(() => BackHandler.exitApp());
        return true;
      });
      return () => subscription.remove();
    }, [form.isDirty, confirmDiscard]),
  );

  const handleSelectCountry = useCallback(
    (country: Country) => {
      form.setField('countryCode', country.code);
      setCountryVisible(false);
    },
    [form],
  );

  const confirmReset = useCallback(() => {
    Alert.alert('Clear profile', 'This removes your saved name, email, birthdate and country.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: form.reset },
    ]);
  }, [form]);

  const country = findCountry(form.draft.countryCode);

  return (
    <Screen>
      <AppHeader title="Settings" subtitle="Profile and appearance" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.content,
            { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          {/* Tapping any blank area puts the keyboard away. */}
          <Pressable accessible={false} onPress={Keyboard.dismiss}>
            <ContentContainer>
              <SectionHeader title="Profile" caption="Saved on this device" />
              <Card>
                <AppInput
                  label="Name"
                  leadingIcon="user"
                  placeholder="Your full name"
                  value={form.draft.name}
                  error={form.errors.name}
                  onChangeText={text => form.setField('name', text)}
                  onBlur={() => form.validateField('name')}
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  submitBehavior="submit"
                />
                <View style={{ height: theme.spacing.md }} />
                <AppInput
                  ref={emailRef}
                  label="Email address"
                  leadingIcon="mail"
                  placeholder="name@company.com"
                  value={form.draft.email}
                  error={form.errors.email}
                  onChangeText={text => form.setField('email', text)}
                  onBlur={() => form.validateField('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="done"
                />
                <View style={{ height: theme.spacing.md }} />
                <BirthdatePicker
                  value={form.draft.birthdate}
                  error={form.errors.birthdate}
                  onChange={iso => form.setField('birthdate', iso)}
                />
                <View style={{ height: theme.spacing.md }} />
                <SelectField
                  label="Country"
                  leadingIcon="globe"
                  placeholder="Select your country"
                  prefix={country?.flag}
                  value={country?.name ?? null}
                  error={form.errors.countryCode}
                  onPress={() => {
                    Keyboard.dismiss();
                    setCountryVisible(true);
                  }}
                  accessibilityHint="Opens a searchable list of countries"
                />
              </Card>

              <View style={{ marginTop: theme.spacing.xl }}>
                <SectionHeader title="Appearance" caption="Applies immediately" />
                <Card>
                  <ThemeSelector />
                  <AppText variant="bodySM" color="textMuted" style={{ marginTop: theme.spacing.sm }}>
                    System follows your device's light or dark setting. Your choice is remembered the
                    next time you open Agreem.
                  </AppText>
                </Card>
              </View>

              <View style={{ marginTop: theme.spacing.xl }}>
                <AppButton
                  label="Save changes"
                  successLabel="Saved successfully"
                  state={form.saveState}
                  onPress={form.save}
                  disabled={!form.isHydrated}
                  accessibilityHint="Validates and saves your profile on this device"
                />
                {form.hasContent ? (
                  <AppButton
                    label="Clear profile"
                    variant="ghost"
                    onPress={confirmReset}
                    style={{ marginTop: theme.spacing.xs }}
                  />
                ) : null}
                {form.isDirty ? (
                  <AppText
                    variant="bodySM"
                    color="textMuted"
                    center
                    style={{ marginTop: theme.spacing.sm }}>
                    You have unsaved changes.
                  </AppText>
                ) : null}
              </View>
            </ContentContainer>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountrySheet
        visible={countryVisible}
        selectedCode={form.draft.countryCode}
        onClose={() => setCountryVisible(false)}
        onSelect={handleSelectCountry}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
});
