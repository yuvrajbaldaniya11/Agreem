import { Country } from '../types';

/**
 * Flags are rendered from the regional-indicator pair derived from the ISO code
 * so there is no image asset to ship and nothing to fall out of sync.
 */
const toFlag = (code: string): string =>
  code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');

const raw: Array<[string, string, string]> = [
  ['AE', 'United Arab Emirates', '+971'],
  ['AR', 'Argentina', '+54'],
  ['AT', 'Austria', '+43'],
  ['AU', 'Australia', '+61'],
  ['BD', 'Bangladesh', '+880'],
  ['BE', 'Belgium', '+32'],
  ['BR', 'Brazil', '+55'],
  ['CA', 'Canada', '+1'],
  ['CH', 'Switzerland', '+41'],
  ['CL', 'Chile', '+56'],
  ['CN', 'China', '+86'],
  ['CO', 'Colombia', '+57'],
  ['CZ', 'Czechia', '+420'],
  ['DE', 'Germany', '+49'],
  ['DK', 'Denmark', '+45'],
  ['EG', 'Egypt', '+20'],
  ['ES', 'Spain', '+34'],
  ['ET', 'Ethiopia', '+251'],
  ['FI', 'Finland', '+358'],
  ['FR', 'France', '+33'],
  ['GB', 'United Kingdom', '+44'],
  ['GH', 'Ghana', '+233'],
  ['GR', 'Greece', '+30'],
  ['HK', 'Hong Kong', '+852'],
  ['HR', 'Croatia', '+385'],
  ['HU', 'Hungary', '+36'],
  ['ID', 'Indonesia', '+62'],
  ['IE', 'Ireland', '+353'],
  ['IL', 'Israel', '+972'],
  ['IN', 'India', '+91'],
  ['IQ', 'Iraq', '+964'],
  ['IT', 'Italy', '+39'],
  ['JP', 'Japan', '+81'],
  ['KE', 'Kenya', '+254'],
  ['KR', 'South Korea', '+82'],
  ['KW', 'Kuwait', '+965'],
  ['LK', 'Sri Lanka', '+94'],
  ['MA', 'Morocco', '+212'],
  ['MX', 'Mexico', '+52'],
  ['MY', 'Malaysia', '+60'],
  ['NG', 'Nigeria', '+234'],
  ['NL', 'Netherlands', '+31'],
  ['NO', 'Norway', '+47'],
  ['NP', 'Nepal', '+977'],
  ['NZ', 'New Zealand', '+64'],
  ['OM', 'Oman', '+968'],
  ['PE', 'Peru', '+51'],
  ['PH', 'Philippines', '+63'],
  ['PK', 'Pakistan', '+92'],
  ['PL', 'Poland', '+48'],
  ['PT', 'Portugal', '+351'],
  ['QA', 'Qatar', '+974'],
  ['RO', 'Romania', '+40'],
  ['RS', 'Serbia', '+381'],
  ['RU', 'Russia', '+7'],
  ['SA', 'Saudi Arabia', '+966'],
  ['SE', 'Sweden', '+46'],
  ['SG', 'Singapore', '+65'],
  ['TH', 'Thailand', '+66'],
  ['TN', 'Tunisia', '+216'],
  ['TR', 'Türkiye', '+90'],
  ['TW', 'Taiwan', '+886'],
  ['TZ', 'Tanzania', '+255'],
  ['UA', 'Ukraine', '+380'],
  ['UG', 'Uganda', '+256'],
  ['US', 'United States', '+1'],
  ['UY', 'Uruguay', '+598'],
  ['VN', 'Vietnam', '+84'],
  ['ZA', 'South Africa', '+27'],
];

export const COUNTRIES: Country[] = raw
  .map(([code, name, dialCode]) => ({ code, name, dialCode, flag: toFlag(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

const byCode = new Map(COUNTRIES.map(country => [country.code, country]));

export const findCountry = (code: string | null | undefined): Country | undefined =>
  code ? byCode.get(code) : undefined;
