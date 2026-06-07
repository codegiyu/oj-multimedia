import { describe, expect, it } from 'vitest';
import { isDeferredPortalAuthResponse, portalLayoutLoadError } from './portalLayoutGate';

describe('portalLayoutGate', () => {
  it('treats prefetch 204 as deferred, not a load error', () => {
    expect(isDeferredPortalAuthResponse(204)).toBe(true);
    expect(portalLayoutLoadError(true, 204, 'Skipped prefetch', 'fallback')).toBeNull();
  });

  it('returns message for real errors', () => {
    expect(portalLayoutLoadError(true, 500, 'Server error', 'fallback')).toBe('Server error');
  });

  it('returns null for profile-missing codes', () => {
    expect(portalLayoutLoadError(true, 403, 'Forbidden', 'fallback')).toBeNull();
    expect(portalLayoutLoadError(true, 404, 'Not found', 'fallback')).toBeNull();
  });
});
