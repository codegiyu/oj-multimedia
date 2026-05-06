import { describe, expect, it } from 'vitest';
import { sanitizeInternalRedirect } from '@/lib/utils/redirect';

describe('sanitizeInternalRedirect', () => {
  const fallback = '/account';

  it('returns fallback for unsafe redirects', () => {
    expect(sanitizeInternalRedirect('', fallback)).toBe(fallback);
    expect(sanitizeInternalRedirect('https://evil.com', fallback)).toBe(fallback);
    expect(sanitizeInternalRedirect('//evil.com', fallback)).toBe(fallback);
    expect(sanitizeInternalRedirect('/\\evil', fallback)).toBe(fallback);
    expect(sanitizeInternalRedirect('/path\\evil', fallback)).toBe(fallback);
  });

  it('allows valid internal redirects', () => {
    expect(sanitizeInternalRedirect('/marketplace/orders', fallback)).toBe('/marketplace/orders');
    expect(sanitizeInternalRedirect('/admin/dashboard/home?tab=music', fallback)).toBe(
      '/admin/dashboard/home?tab=music'
    );
  });
});
