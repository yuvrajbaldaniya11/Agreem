import {
  hasErrors,
  validateBirthdate,
  validateCountry,
  validateEmail,
  validateName,
  validateProfile,
} from '../src/utils/validation';

describe('name validation', () => {
  it('rejects empty and whitespace-only names', () => {
    expect(validateName('')).toBeDefined();
    expect(validateName('   ')).toBeDefined();
  });

  it('accepts a normal name and ignores surrounding whitespace', () => {
    expect(validateName('  Amara Okafor  ')).toBeUndefined();
  });

  it('rejects names beyond the maximum length', () => {
    expect(validateName('a'.repeat(51))).toBeDefined();
  });
});

describe('email validation', () => {
  it.each(['name@company.com', 'first.last@sub.domain.co'])('accepts %s', value => {
    expect(validateEmail(value)).toBeUndefined();
  });

  it.each(['', 'name', 'name@', 'name@domain', 'a b@domain.com'])('rejects %s', value => {
    expect(validateEmail(value)).toBeDefined();
  });
});

describe('birthdate validation', () => {
  it('requires a value', () => {
    expect(validateBirthdate(null)).toBeDefined();
  });

  it('rejects a future date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(validateBirthdate(future.toISOString())).toBeDefined();
  });

  it('rejects an unreadable date', () => {
    expect(validateBirthdate('not-a-date')).toBeDefined();
  });

  it('accepts a past date', () => {
    expect(validateBirthdate(new Date(1990, 4, 12).toISOString())).toBeUndefined();
  });
});

describe('profile validation', () => {
  it('reports every missing field at once', () => {
    const errors = validateProfile({ name: '', email: '', birthdate: null, countryCode: null });
    expect(Object.keys(errors).sort()).toEqual(['birthdate', 'countryCode', 'email', 'name']);
    expect(hasErrors(errors)).toBe(true);
  });

  it('passes a complete profile', () => {
    const errors = validateProfile({
      name: 'Amara Okafor',
      email: 'amara@agreem.io',
      birthdate: new Date(1992, 0, 20).toISOString(),
      countryCode: 'NL',
    });
    expect(hasErrors(errors)).toBe(false);
  });

  it('requires a country', () => {
    expect(validateCountry(null)).toBeDefined();
    expect(validateCountry('NL')).toBeUndefined();
  });
});
