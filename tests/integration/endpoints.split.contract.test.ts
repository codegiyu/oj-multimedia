import { describe, expect, it } from 'vitest';
import { ENDPOINTS, API_V1_PREFIX } from '@/lib/constants/endpoints';
import { ADMIN_ENDPOINTS } from '@/lib/constants/endpoints/admin';
import { PUBLIC_ENDPOINTS } from '@/lib/constants/endpoints/public';
import { AUTH_USER_ENDPOINTS } from '@/lib/constants/endpoints/auth';

describe('endpoints module split', () => {
  it('merges split catalogs into ENDPOINTS', () => {
    const mergedKeys = new Set([
      ...Object.keys(AUTH_USER_ENDPOINTS),
      ...Object.keys(ADMIN_ENDPOINTS),
      ...Object.keys(PUBLIC_ENDPOINTS),
    ]);

    for (const key of mergedKeys) {
      expect(ENDPOINTS[key as keyof typeof ENDPOINTS]).toBeDefined();
    }
  });

  it('keeps versioned paths after split', () => {
    for (const endpoint of Object.values(ENDPOINTS)) {
      expect(endpoint.path.startsWith(API_V1_PREFIX)).toBe(true);
    }
  });
});
