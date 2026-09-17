import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKey = {
  themePreference: '@agreem/theme-preference',
  profile: '@agreem/profile',
  photo: '@agreem/photo',
  deviceInfoConsent: '@agreem/device-info-consent',
} as const;

export type StorageKeyName = (typeof StorageKey)[keyof typeof StorageKey];

/**
 * Storage must never take the app down: a corrupt or unavailable store
 * degrades to "no saved value" instead of throwing into a render.
 */
export const readJSON = async <T>(key: StorageKeyName): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.warn(`[storage] failed to read ${key}`, error);
    return null;
  }
};

export const writeJSON = async <T>(key: StorageKeyName, value: T): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] failed to write ${key}`, error);
    return false;
  }
};

export const remove = async (key: StorageKeyName): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] failed to remove ${key}`, error);
  }
};
