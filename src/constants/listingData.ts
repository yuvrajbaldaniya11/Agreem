// Scoped to the English locale only — the root `@faker-js/faker` export
// bundles every locale's data, which would needlessly bloat the app.
import { faker } from '@faker-js/faker/locale/en';
import { ListingItem, ListingStatus } from '../types';

/**
 * faker seeds its own PRNG, so a given seed always rebuilds the same set of
 * records (deterministic), while a fresh seed on each pull-to-refresh still
 * produces a realistic-looking, varied directory.
 */

const STATUSES: ListingStatus[] = ['active', 'active', 'active', 'pending', 'inactive'];

/** Avatar tints — curated rather than random, so every avatar sits comfortably on both light and dark cards. */
const ACCENTS = ['#027FC5', '#08C9BC', '#7C6BF0', '#F0883B', '#E0567A', '#2FA36B'];

export const generateListing = (count: number, seed: number = Date.now()): ListingItem[] => {
  faker.seed(seed);
  const usedEmails = new Set<string>();
  const items: ListingItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;

    let email = faker.internet.email({ firstName, lastName, provider: 'agreem.io' }).toLowerCase();
    while (usedEmails.has(email)) {
      email = faker.internet.email({ firstName, lastName, provider: 'agreem.io' }).toLowerCase();
    }
    usedEmails.add(email);

    // Built from seeded integers rather than faker.date.past(), which anchors
    // to the live wall clock and would make two calls a millisecond apart
    // (as in a same-seed equality test) produce slightly different results.
    const monthsAgo = faker.number.int({ min: 1, max: 30 });
    const day = faker.number.int({ min: 1, max: 28 });
    const today = new Date();
    const joined = new Date(today.getFullYear(), today.getMonth() - monthsAgo, day);

    items.push({
      id: `${seed}-${index}`,
      name,
      email,
      role: faker.person.jobTitle(),
      location: `${faker.location.city()}, ${faker.location.countryCode()}`,
      status: faker.helpers.arrayElement(STATUSES),
      initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
      accent: faker.helpers.arrayElement(ACCENTS),
      joinedAt: joined.toISOString(),
    });
  }

  return items;
};
