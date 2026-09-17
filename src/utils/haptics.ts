import { Platform, Vibration } from 'react-native';

/**
 * Deliberately built on the core Vibration API rather than an extra native
 * dependency: the app only needs short confirmation taps.
 */
const tap = (pattern: number) => {
  if (Platform.OS === 'android') {
    Vibration.vibrate(pattern);
  }
};

export const haptics = {
  selection: () => tap(8),
  confirm: () => tap(14),
  success: () => tap(22),
};
