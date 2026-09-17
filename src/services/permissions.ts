import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { PermissionState } from '../types';

/**
 * Android 13 (API 33) introduced the system photo picker, which hands back a
 * single user-chosen image without any storage permission. Asking for one there
 * would be an unnecessary permission, so we only request on API 32 and below.
 */
export const isGalleryPermissionRequired = (): boolean =>
  Platform.OS === 'android' && Number(Platform.Version) <= 32;

export const checkGalleryPermission = async (): Promise<PermissionState> => {
  if (!isGalleryPermissionRequired()) {
    return 'not-required';
  }
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    return granted ? 'granted' : 'denied';
  } catch (error) {
    console.warn('[permissions] check failed', error);
    return 'unavailable';
  }
};

export const requestGalleryPermission = async (): Promise<PermissionState> => {
  if (!isGalleryPermissionRequired()) {
    return 'not-required';
  }
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Allow access to your photos',
        message: 'Agreem needs access to your photo library so you can pick a profile photo.',
        buttonPositive: 'Allow',
        buttonNegative: 'Not now',
      },
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return 'granted';
    }
    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return 'blocked';
    }
    return 'denied';
  } catch (error) {
    console.warn('[permissions] request failed', error);
    return 'unavailable';
  }
};

export const openAppSettings = async (): Promise<boolean> => {
  try {
    await Linking.openSettings();
    return true;
  } catch (error) {
    console.warn('[permissions] unable to open settings', error);
    return false;
  }
};
