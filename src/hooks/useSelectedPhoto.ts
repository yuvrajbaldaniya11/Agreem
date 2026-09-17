import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionState, SelectedPhoto } from '../types';
import { pickPhotoFromLibrary } from '../services/gallery';
import {
  checkGalleryPermission,
  openAppSettings,
  requestGalleryPermission,
} from '../services/permissions';
import { readJSON, remove, StorageKey, writeJSON } from '../services/storage';
import { useToast } from '../providers/ToastProvider';

export interface PhotoState {
  photo: SelectedPhoto | null;
  isOpening: boolean;
  isHydrated: boolean;
  permission: PermissionState;
  error: string | null;
  pickPhoto: () => void;
  removePhoto: () => void;
  openSettings: () => void;
  /** Called when a restored URI can no longer be decoded. */
  handleBrokenImage: () => void;
}

export const useSelectedPhoto = (): PhotoState => {
  const { showToast } = useToast();

  const [photo, setPhoto] = useState<SelectedPhoto | null>(null);
  const [isOpening, setOpening] = useState(false);
  const [isHydrated, setHydrated] = useState(false);
  const [permission, setPermission] = useState<PermissionState>('idle');
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);
  /** Stops a second tap from launching a second picker activity. */
  const busy = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([readJSON<SelectedPhoto>(StorageKey.photo), checkGalleryPermission()]).then(
      ([stored, state]) => {
        if (!active) {
          return;
        }
        if (stored?.uri) {
          setPhoto(stored);
        }
        setPermission(state);
        setHydrated(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const pickPhoto = useCallback(async () => {
    if (busy.current) {
      return;
    }
    busy.current = true;
    setError(null);
    setOpening(true);

    try {
      let state = await checkGalleryPermission();
      if (state === 'denied') {
        setPermission('checking');
        state = await requestGalleryPermission();
      }
      if (!mounted.current) {
        return;
      }
      setPermission(state);

      if (state !== 'granted' && state !== 'not-required') {
        // 'blocked' is surfaced by the caller reacting to `permission` directly;
        // 'denied' just means the request needs explaining before a retry helps.
        if (state === 'denied') {
          showToast({ message: 'Photo access is needed to set a profile photo.', variant: 'error' });
        }
        return;
      }

      const result = await pickPhotoFromLibrary();
      if (!mounted.current) {
        return;
      }

      if (result.status === 'selected') {
        setPhoto(result.photo);
        writeJSON(StorageKey.photo, result.photo);
        showToast({ message: 'Photo added to your profile.', variant: 'success' });
      } else if (result.status === 'error') {
        setError(result.message);
        showToast({ message: result.message, variant: 'error' });
      }
      // A cancelled pick is a normal outcome: leave the previous state alone.
    } finally {
      busy.current = false;
      if (mounted.current) {
        setOpening(false);
      }
    }
  }, [showToast]);

  const removePhoto = useCallback(() => {
    setPhoto(null);
    setError(null);
    remove(StorageKey.photo);
    showToast({ message: 'Photo removed.', variant: 'info' });
  }, [showToast]);

  const handleBrokenImage = useCallback(() => {
    setPhoto(null);
    remove(StorageKey.photo);
    setError('That photo is no longer available on this device.');
  }, []);

  const openSettings = useCallback(() => {
    openAppSettings();
  }, []);

  return {
    photo,
    isOpening,
    isHydrated,
    permission,
    error,
    pickPhoto: () => pickPhoto(),
    removePhoto,
    openSettings,
    handleBrokenImage,
  };
};
