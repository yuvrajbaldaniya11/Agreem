import { ProfileErrors, ProfileForm } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 50;
/** Nobody alive was born before this, and it keeps the picker range sane. */
export const MIN_BIRTH_YEAR = 1900;

export const validateName = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Please enter your name.';
  }
  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters.`;
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }
  return undefined;
};

export const validateEmail = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Please enter your email address.';
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address, for example name@company.com.';
  }
  return undefined;
};

export const validateBirthdate = (value: string | null): string | undefined => {
  if (!value) {
    return 'Please choose your birthdate.';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'That date could not be read. Please choose it again.';
  }
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date.getTime() > today.getTime()) {
    return 'Birthdate cannot be in the future.';
  }
  if (date.getFullYear() < MIN_BIRTH_YEAR) {
    return `Birthdate must be after ${MIN_BIRTH_YEAR}.`;
  }
  return undefined;
};

export const validateCountry = (value: string | null): string | undefined =>
  value ? undefined : 'Please select your country.';

export const validateProfile = (form: ProfileForm): ProfileErrors => {
  const errors: ProfileErrors = {};
  const name = validateName(form.name);
  const email = validateEmail(form.email);
  const birthdate = validateBirthdate(form.birthdate);
  const countryCode = validateCountry(form.countryCode);

  if (name) { errors.name = name; }
  if (email) { errors.email = email; }
  if (birthdate) { errors.birthdate = birthdate; }
  if (countryCode) { errors.countryCode = countryCode; }
  return errors;
};

export const hasErrors = (errors: ProfileErrors): boolean => Object.keys(errors).length > 0;
