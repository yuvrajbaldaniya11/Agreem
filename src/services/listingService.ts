import { ListingItem } from '../types';
import { generateListing } from '../constants/listingData';

const PAGE_SIZE = 24;

/**
 * Flip to 'empty' or 'error' while developing to exercise those states without
 * touching the screens. Ships as null so real runs always use real data.
 */
const DEV_FORCE: 'empty' | 'error' | null = null;

/**
 * The data is local, so the only "latency" here is a frame or two to let the
 * skeleton render — deliberately not an artificial multi-second delay.
 */
export const fetchListing = async (): Promise<ListingItem[]> => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 350));

  if (DEV_FORCE === 'error') {
    throw new Error('Forced listing failure');
  }
  if (DEV_FORCE === 'empty') {
    return [];
  }

  const items = generateListing(PAGE_SIZE);
  if (!Array.isArray(items)) {
    throw new Error('Listing data could not be built');
  }
  return items;
};
