import { formatDate, formatJoined, maskIdentifier } from '../src/utils/format';
import { formatDeviceName } from '../src/services/device';

describe('formatDate', () => {
  it('formats a valid date', () => {
    expect(formatDate(new Date(1992, 0, 20))).toBe('20 Jan 1992');
  });

  it('never surfaces an invalid date to the UI', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

describe('formatJoined', () => {
  it('falls back to a readable label when the date is unusable', () => {
    expect(formatJoined('nonsense')).toBe('Join date unavailable');
  });
});

describe('maskIdentifier', () => {
  it('leaves short values alone and masks long ones', () => {
    expect(maskIdentifier('abc123')).toBe('abc123');
    expect(maskIdentifier('0123456789abcdef')).toBe('012345••••cdef');
  });
});

describe('formatDeviceName', () => {
  it('does not repeat a brand the model already carries', () => {
    expect(formatDeviceName('vivo', 'vivo 1901')).toBe('vivo 1901');
    expect(formatDeviceName('Google', 'Pixel 7')).toBe('Google Pixel 7');
  });

  it('degrades gracefully when a value is missing', () => {
    expect(formatDeviceName('Not available', 'Pixel 7')).toBe('Pixel 7');
    expect(formatDeviceName('Google', 'Not available')).toBe('Google');
    expect(formatDeviceName('Not available', 'Not available')).toBe('Not available');
  });
});
