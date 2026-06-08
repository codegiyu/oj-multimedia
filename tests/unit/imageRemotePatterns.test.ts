import { describe, expect, it } from 'vitest';
import {
  BLOCKED_IMAGE_REMOTE_HOSTS,
  IMAGE_REMOTE_PATTERNS,
} from '@/lib/config/imageRemotePatterns';

describe('image remotePatterns allowlist', () => {
  it('does not allow arbitrary external hostnames', () => {
    expect(IMAGE_REMOTE_PATTERNS.some(pattern => pattern.hostname === '**')).toBe(false);

    for (const blockedHost of BLOCKED_IMAGE_REMOTE_HOSTS) {
      expect(IMAGE_REMOTE_PATTERNS.some(pattern => pattern.hostname === blockedHost)).toBe(false);
    }
  });

  it('includes production CDN and avatar hosts', () => {
    const hostnames = IMAGE_REMOTE_PATTERNS.map(pattern => pattern.hostname);

    expect(hostnames).toContain('static.ojmultimedia.com');
    expect(hostnames).toContain('**.r2.dev');
    expect(hostnames).toContain('lh3.googleusercontent.com');
  });
});
