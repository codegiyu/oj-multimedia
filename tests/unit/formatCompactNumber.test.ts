import { describe, expect, it } from 'vitest';
import { formatCompactNumber } from '@/lib/utils/general';
import { formatAdminTableDate } from '@/lib/utils/adminTableFormat';

describe('formatCompactNumber', () => {
  it('returns 0 for nullish and NaN', () => {
    expect(formatCompactNumber(null)).toBe('0');
    expect(formatCompactNumber(undefined)).toBe('0');
    expect(formatCompactNumber(Number.NaN)).toBe('0');
  });

  it('formats values below 1000 as plain numbers', () => {
    expect(formatCompactNumber(0)).toBe('0');
    expect(formatCompactNumber(999)).toBe('999');
  });

  it('formats thousands and millions with compact suffixes', () => {
    expect(formatCompactNumber(1145)).toBe('1.15K');
    expect(formatCompactNumber(2880000)).toBe('2.88M');
    expect(formatCompactNumber(1099)).toBe('1K');
  });
});

describe('formatAdminTableDate', () => {
  it('uses three-letter month abbreviations', () => {
    expect(formatAdminTableDate('2025-12-05T12:00:00.000Z')).toMatch(/^Dec /);
  });

  it('supports optional time', () => {
    const value = formatAdminTableDate('2025-12-05T14:30:00.000Z', { dateTime: true });
    expect(value).toMatch(/^Dec 5, 2025 \d{2}:\d{2}$/);
  });
});
