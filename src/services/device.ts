import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { DeviceDetails } from '../types';

const UNAVAILABLE = 'Not available';

/**
 * Device-info calls can reject or resolve to empty strings on some OEM builds,
 * so every field is resolved independently and falls back to a friendly label.
 */
const safe = async (read: () => string | Promise<string>): Promise<string> => {
  try {
    const value = await read();
    const trimmed = typeof value === 'string' ? value.trim() : '';
    return trimmed.length > 0 && trimmed !== 'unknown' ? trimmed : UNAVAILABLE;
  } catch (error) {
    console.warn('[device] failed to read value', error);
    return UNAVAILABLE;
  }
};

export const isUnavailable = (value: string): boolean => value === UNAVAILABLE;

/**
 * Many OEMs already repeat the brand inside the model string ("vivo" +
 * "vivo 1901"), so joining them blindly reads as "vivo vivo 1901".
 */
export const formatDeviceName = (brand: string, model: string): string => {
  if (isUnavailable(model)) {
    return isUnavailable(brand) ? UNAVAILABLE : brand;
  }
  if (isUnavailable(brand) || model.toLowerCase().startsWith(brand.toLowerCase())) {
    return model;
  }
  return `${brand} ${model}`;
};

export const getDeviceDetails = async (): Promise<DeviceDetails> => {
  const [brand, model, deviceId, systemVersion, appVersion, buildNumber, deviceType] =
    await Promise.all([
      safe(() => DeviceInfo.getBrand()),
      safe(() => DeviceInfo.getModel()),
      safe(() => DeviceInfo.getUniqueId()),
      safe(() => DeviceInfo.getSystemVersion()),
      safe(() => DeviceInfo.getVersion()),
      safe(() => DeviceInfo.getBuildNumber()),
      safe(() => DeviceInfo.getDeviceType()),
    ]);

  return {
    os: Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : Platform.OS,
    systemVersion,
    apiLevel: Platform.OS === 'android' ? String(Platform.Version) : UNAVAILABLE,
    brand,
    model,
    deviceId,
    deviceType,
    appVersion: appVersion === UNAVAILABLE ? UNAVAILABLE : `${appVersion} (${buildNumber})`,
  };
};
