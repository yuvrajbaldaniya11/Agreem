import { generateListing } from '../src/constants/listingData';
import { COUNTRIES, findCountry } from '../src/constants/countries';

describe('generateListing', () => {
  it('produces the requested number of records with unique keys', () => {
    const items = generateListing(24, 1234);
    expect(items).toHaveLength(24);
    expect(new Set(items.map(item => item.id)).size).toBe(24);
    expect(new Set(items.map(item => item.email)).size).toBe(24);
  });

  it('is deterministic for a given seed', () => {
    expect(generateListing(5, 99)).toEqual(generateListing(5, 99));
  });

  it('fills every field the card renders', () => {
    for (const item of generateListing(10, 7)) {
      expect(item.name.trim().length).toBeGreaterThan(0);
      expect(item.initials).toHaveLength(2);
      expect(item.accent).toMatch(/^#[0-9A-F]{6}$/i);
      expect(Number.isNaN(new Date(item.joinedAt).getTime())).toBe(false);
    }
  });
});

describe('countries', () => {
  it('is sorted by name and has unique codes', () => {
    const names = COUNTRIES.map(country => country.name);
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
    expect(new Set(COUNTRIES.map(country => country.code)).size).toBe(COUNTRIES.length);
  });

  it('derives a flag for every country', () => {
    expect(COUNTRIES.every(country => country.flag.length > 0)).toBe(true);
    expect(findCountry('NL')?.name).toBe('Netherlands');
    expect(findCountry(null)).toBeUndefined();
  });
});
