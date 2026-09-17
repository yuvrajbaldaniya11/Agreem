import { useCallback, useEffect, useRef, useState } from 'react';
import { AsyncStatus, ListingItem } from '../types';
import { fetchListing } from '../services/listingService';

interface ListingState {
  status: AsyncStatus;
  items: ListingItem[];
  isRefreshing: boolean;
  refresh: () => void;
  retry: () => void;
}

export const useListing = (): ListingState => {
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [items, setItems] = useState<ListingItem[]>([]);
  const [isRefreshing, setRefreshing] = useState(false);

  const mounted = useRef(true);
  /** Guards against overlapping loads from a fast double pull-to-refresh. */
  const inFlight = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    if (inFlight.current) {
      return;
    }
    inFlight.current = true;

    if (mode === 'refresh') {
      setRefreshing(true);
    } else {
      setStatus('loading');
    }

    try {
      const next = await fetchListing();
      if (!mounted.current) {
        return;
      }
      setItems(next);
      setStatus('success');
    } catch (error) {
      console.warn('[listing] load failed', error);
      if (mounted.current) {
        setStatus('error');
      }
    } finally {
      inFlight.current = false;
      if (mounted.current) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    load('initial');
  }, [load]);

  const refresh = useCallback(() => {
    load('refresh');
  }, [load]);

  const retry = useCallback(() => {
    load('initial');
  }, [load]);

  return { status, items, isRefreshing, refresh, retry };
};
