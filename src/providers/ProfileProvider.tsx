import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ProfileForm } from '../types';
import { readJSON, remove, StorageKey, writeJSON } from '../services/storage';

export const EMPTY_PROFILE: ProfileForm = {
  name: '',
  email: '',
  birthdate: null,
  countryCode: null,
};

interface ProfileContextValue {
  profile: ProfileForm;
  isHydrated: boolean;
  saveProfile: (next: ProfileForm) => Promise<boolean>;
  clearProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

const isProfile = (value: unknown): value is ProfileForm =>
  typeof value === 'object' && value !== null && 'name' in value && 'email' in value;

/**
 * Owns the persisted profile. Settings edits a draft copy and commits here;
 * Home reads it to personalise the dashboard.
 */
export const ProfileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileForm>(EMPTY_PROFILE);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    readJSON<ProfileForm>(StorageKey.profile).then(stored => {
      if (!mounted) {
        return;
      }
      if (isProfile(stored)) {
        setProfile({ ...EMPTY_PROFILE, ...stored });
      }
      setHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const saveProfile = useCallback(async (next: ProfileForm) => {
    const normalised: ProfileForm = {
      ...next,
      name: next.name.trim(),
      email: next.email.trim(),
    };
    const ok = await writeJSON(StorageKey.profile, normalised);
    if (ok) {
      setProfile(normalised);
    }
    return ok;
  }, []);

  const clearProfile = useCallback(async () => {
    await remove(StorageKey.profile);
    setProfile(EMPTY_PROFILE);
  }, []);

  const value = useMemo(
    () => ({ profile, isHydrated, saveProfile, clearProfile }),
    [profile, isHydrated, saveProfile, clearProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextValue => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider');
  }
  return context;
};
