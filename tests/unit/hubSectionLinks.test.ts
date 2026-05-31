import { describe, expect, it } from 'vitest';
import { resolveHubViewAllLink } from '@/lib/utils/hubSectionLinks';

describe('resolveHubViewAllLink', () => {
  it('returns the link when it differs from the current path', () => {
    expect(resolveHubViewAllLink('/community/devotionals', '/community')).toBe(
      '/community/devotionals'
    );
  });

  it('returns undefined when the link matches the current hub path', () => {
    expect(
      resolveHubViewAllLink('/community/devotionals', '/community/devotionals')
    ).toBeUndefined();
  });

  it('returns undefined when viewAllLink is undefined', () => {
    expect(resolveHubViewAllLink(undefined, '/community/devotionals')).toBeUndefined();
  });
});
