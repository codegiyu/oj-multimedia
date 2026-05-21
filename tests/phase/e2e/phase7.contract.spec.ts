import { expect, test } from '@playwright/test';
import { API_V1_PREFIX } from '../../../lib/constants/endpoints';
import { ADMIN_ENDPOINTS } from '../../../lib/constants/endpoints/admin';
import { PUBLIC_ENDPOINTS } from '../../../lib/constants/endpoints/public';

test.describe('Phase 7 contract', () => {
  test('admin and public endpoint catalogs are split', () => {
    expect(Object.keys(ADMIN_ENDPOINTS).some(key => key.startsWith('ADMIN_'))).toBe(true);
    expect(Object.keys(PUBLIC_ENDPOINTS).some(key => key.startsWith('PUBLIC_'))).toBe(true);
  });

  test('split catalogs keep versioned paths', () => {
    for (const endpoint of Object.values(ADMIN_ENDPOINTS)) {
      expect(endpoint.path.startsWith(API_V1_PREFIX)).toBe(true);
    }
  });
});
