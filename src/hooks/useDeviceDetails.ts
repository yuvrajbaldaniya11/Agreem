import { useCallback, useEffect, useRef, useState } from 'react';
import { AsyncStatus, DeviceDetails } from '../types';
import { getDeviceDetails } from '../services/device';
import { readJSON, StorageKey, writeJSON } from '../services/storage';

export type DeviceConsent = 'unknown' | 'pending' | 'granted';

interface DeviceState {
  /** 'unknown' while the saved choice is still being read, so we never flash the prompt needlessly. */
  consent: DeviceConsent;
  status: AsyncStatus;
  details: DeviceDetails | null;
  retry: () => void;
  /** Grants consent (remembered for next time) and reads the device details. */
  allow: () => void;
}

export const useDeviceDetails = (): DeviceState => {
  const [consent, setConsent] = useState<DeviceConsent>('unknown');
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [details, setDetails] = useState<DeviceDetails | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const next = await getDeviceDetails();
      if (!mounted.current) {
        return;
      }
      setDetails(next);
      setStatus('success');
    } catch (error) {
      console.warn('[device] details failed', error);
      if (mounted.current) {
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    readJSON<boolean>(StorageKey.deviceInfoConsent).then(granted => {
      if (!active) {
        return;
      }
      setConsent(granted ? 'granted' : 'pending');
      if (granted) {
        load();
      }
    });
    return () => {
      active = false;
    };
  }, [load]);

  const allow = useCallback(() => {
    setConsent('granted');
    writeJSON(StorageKey.deviceInfoConsent, true);
    load();
  }, [load]);

  return { consent, status, details, retry: load, allow };
};
