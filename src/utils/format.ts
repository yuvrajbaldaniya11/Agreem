const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

/** Never surfaces "Invalid Date" to a user. */
export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) {
    return '';
  }
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  try {
    return new Intl.DateTimeFormat('en-GB', DATE_FORMAT).format(date);
  } catch {
    return date.toDateString();
  }
};

export const formatJoined = (iso: string): string => {
  const formatted = formatDate(iso);
  return formatted ? `Joined ${formatted}` : 'Join date unavailable';
};

/** Masks all but the first and last few characters of an identifier. */
export const maskIdentifier = (value: string): string => {
  if (value.length <= 10) {
    return value;
  }
  return `${value.slice(0, 6)}••••${value.slice(-4)}`;
};
