import { describe, expect, it } from 'vitest';
import { resolveAuthCookieDomain } from './authCookieDomain';

describe('resolveAuthCookieDomain', () => {
  it('returns configured domain when set', () => {
    expect(resolveAuthCookieDomain('www.ojmultimedia.com', '.ojmultimedia.com')).toBe(
      '.ojmultimedia.com'
    );
  });

  it('returns undefined for localhost', () => {
    expect(resolveAuthCookieDomain('localhost')).toBeUndefined();
    expect(resolveAuthCookieDomain('app.localhost')).toBeUndefined();
  });
});
