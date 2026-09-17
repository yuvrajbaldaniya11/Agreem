import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonState } from '../components/AppButton';
import { EMPTY_PROFILE, useProfile } from '../providers/ProfileProvider';
import { useToast } from '../providers/ToastProvider';
import { ProfileErrors, ProfileForm, ProfileFormField } from '../types';
import { haptics } from '../utils/haptics';
import {
  hasErrors,
  validateBirthdate,
  validateCountry,
  validateEmail,
  validateName,
  validateProfile,
} from '../utils/validation';

const SUCCESS_MS = 1800;

/** Returns a copy of the error map without one field. */
const omit = (errors: ProfileErrors, field: ProfileFormField): ProfileErrors => {
  const next = { ...errors };
  delete next[field];
  return next;
};

const fieldValidator = (field: ProfileFormField, draft: ProfileForm): string | undefined => {
  switch (field) {
    case 'name':
      return validateName(draft.name);
    case 'email':
      return validateEmail(draft.email);
    case 'birthdate':
      return validateBirthdate(draft.birthdate);
    case 'countryCode':
      return validateCountry(draft.countryCode);
    default:
      return undefined;
  }
};

export const useProfileForm = () => {
  const { profile, isHydrated, saveProfile, clearProfile } = useProfile();
  const { showToast } = useToast();

  const [draft, setDraft] = useState<ProfileForm>(profile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saveState, setSaveState] = useState<ButtonState>('idle');

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Blocks a second Save while the first one is still in flight. */
  const saving = useRef(false);

  // Adopt the stored values once, as soon as they arrive.
  const hydratedOnce = useRef(false);
  useEffect(() => {
    if (isHydrated && !hydratedOnce.current) {
      hydratedOnce.current = true;
      setDraft(profile);
    }
  }, [isHydrated, profile]);

  useEffect(
    () => () => {
      if (successTimer.current) {
        clearTimeout(successTimer.current);
      }
    },
    [],
  );

  const setField = useCallback(
    <K extends ProfileFormField>(field: K, value: ProfileForm[K]) => {
      setDraft(current => {
        const next = { ...current, [field]: value };
        // Clear a field's error as soon as it becomes valid — never mid-typing noise.
        setErrors(currentErrors => {
          if (!currentErrors[field] || fieldValidator(field, next)) {
            return currentErrors;
          }
          return omit(currentErrors, field);
        });
        return next;
      });
      setSaveState('idle');
    },
    [],
  );

  const validateField = useCallback(
    (field: ProfileFormField) => {
      setErrors(current => {
        const message = fieldValidator(field, draft);
        return message ? { ...current, [field]: message } : omit(current, field);
      });
    },
    [draft],
  );

  const isDirty = useMemo(
    () =>
      draft.name.trim() !== profile.name.trim() ||
      draft.email.trim() !== profile.email.trim() ||
      draft.birthdate !== profile.birthdate ||
      draft.countryCode !== profile.countryCode,
    [draft, profile],
  );

  const hasContent = useMemo(
    () =>
      Boolean(draft.name.trim() || draft.email.trim() || draft.birthdate || draft.countryCode),
    [draft],
  );

  const save = useCallback(async () => {
    if (saving.current) {
      return;
    }
    const nextErrors = validateProfile(draft);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      showToast({ message: 'Please fix the highlighted fields.', variant: 'error' });
      return;
    }

    saving.current = true;
    setSaveState('loading');

    const ok = await saveProfile(draft);

    saving.current = false;
    if (!ok) {
      setSaveState('idle');
      showToast({ message: 'We could not save your changes. Please try again.', variant: 'error' });
      return;
    }

    haptics.success();
    setSaveState('success');
    showToast({ message: 'Saved successfully.', variant: 'success' });
    successTimer.current = setTimeout(() => setSaveState('idle'), SUCCESS_MS);
  }, [draft, saveProfile, showToast]);

  const reset = useCallback(async () => {
    await clearProfile();
    setDraft(EMPTY_PROFILE);
    setErrors({});
    setSaveState('idle');
    showToast({ message: 'Profile cleared.', variant: 'info' });
  }, [clearProfile, showToast]);

  const discard = useCallback(() => {
    setDraft(profile);
    setErrors({});
    setSaveState('idle');
  }, [profile]);

  return {
    draft,
    errors,
    saveState,
    isDirty,
    hasContent,
    isHydrated,
    setField,
    validateField,
    save: () => {
      save();
    },
    reset: () => {
      reset();
    },
    discard,
  };
};
