import { describe, expect, it } from 'vitest';
import { base64UrlEncode } from '@/lib/services/storage';
import { resolveRedirectDestination, sanitizeInternalRedirect } from '@/lib/utils/redirect';

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

describe('resolveRedirectDestination', () => {
  const fallback = '/account';

  it('returns fallback when redirectTo is empty or missing', () => {
    expect(resolveRedirectDestination(null, fallback)).toBe(fallback);
    expect(resolveRedirectDestination(undefined, fallback)).toBe(fallback);
    expect(resolveRedirectDestination('', fallback)).toBe(fallback);
  });

  it('decodes valid base64-encoded internal paths', () => {
    const encoded = base64UrlEncode('/account/settings');
    expect(resolveRedirectDestination(encoded, fallback)).toBe('/account/settings');
  });

  it('preserves query strings in decoded paths', () => {
    const encoded = base64UrlEncode('/account/settings?tab=profile');
    expect(resolveRedirectDestination(encoded, fallback)).toBe('/account/settings?tab=profile');
  });

  it('returns fallback for unsafe decoded redirects', () => {
    const encoded = base64UrlEncode('https://evil.com');
    expect(resolveRedirectDestination(encoded, fallback)).toBe(fallback);
  });

  it('returns fallback for invalid base64', () => {
    expect(resolveRedirectDestination('not-valid-base64!!!', fallback)).toBe(fallback);
  });
});
