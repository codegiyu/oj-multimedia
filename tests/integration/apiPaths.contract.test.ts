import { describe, expect, it } from 'vitest';
import { API_V1_PREFIX, ENDPOINTS } from '@/lib/constants/endpoints';

describe('ENDPOINTS API v1 contract', () => {
  it('exports the shared v1 prefix constant', () => {
    expect(API_V1_PREFIX).toBe('/api/v1');
  });

  it('versions every backend endpoint path', () => {
    for (const [key, endpoint] of Object.entries(ENDPOINTS)) {
      expect(endpoint.path.startsWith(`${API_V1_PREFIX}/`), `${key}: ${endpoint.path}`).toBe(true);
    }
  });
});
