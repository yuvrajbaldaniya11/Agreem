export interface DeviceDetails {
  os: string;
  systemVersion: string;
  apiLevel: string;
  brand: string;
  model: string;
  deviceId: string;
  deviceType: string;
  appVersion: string;
}

export type PermissionState =
  | 'idle'
  | 'checking'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable'
  /** The current OS version does not need a permission for this feature. */
  | 'not-required';

export interface SelectedPhoto {
  uri: string;
  width: number;
  height: number;
  fileName: string;
  fileSize: number;
}

export type GalleryResult =
  | { status: 'selected'; photo: SelectedPhoto }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export type ListingStatus = 'active' | 'pending' | 'inactive';

export interface ListingItem {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  status: ListingStatus;
  initials: string;
  accent: string;
  joinedAt: string;
}

export interface ProfileForm {
  name: string;
  email: string;
  birthdate: string | null;
  countryCode: string | null;
}

export type ProfileFormField = keyof ProfileForm;

export type ProfileErrors = Partial<Record<ProfileFormField, string>>;

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
