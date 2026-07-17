import { describe, expect, it } from 'vitest';
import {
  isDeferredPortalAuthResponse,
  portalLayoutCaughtErrorMessage,
  portalLayoutLoadError,
} from './portalLayoutGate';
import {
  buildVendorPortalLayoutGateState,
  vendorPortalLayoutCatchState,
} from './vendorPortalLayoutState';

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

  it('portalLayoutCaughtErrorMessage prefers Error.message', () => {
    expect(portalLayoutCaughtErrorMessage(new Error('boom'), 'fallback')).toBe('boom');
    expect(portalLayoutCaughtErrorMessage('nope', 'fallback')).toBe('fallback');
  });
});

describe('buildVendorPortalLayoutGateState', () => {
  it('treats 403/404 as profile missing without load error', () => {
    const state = buildVendorPortalLayoutGateState({
      type: 'error',
      message: 'No vendor',
      error: { responseCode: 403 },
    });

    expect(state.profileMissing).toBe(true);
    expect(state.loadError).toBeNull();
  });

  it('surfaces 500 as load error, not profile missing', () => {
    const state = buildVendorPortalLayoutGateState({
      type: 'error',
      message: 'Upstream failed',
      error: { responseCode: 500 },
    });

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBe('Upstream failed');
  });

  it('maps successful vendor me payload', () => {
    const state = buildVendorPortalLayoutGateState({
      type: 'success',
      data: {
        _id: 'v1',
        name: 'Store',
        slug: 'store',
        storeName: 'Store',
        status: 'pending',
        isVerified: false,
      },
    });

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBeNull();
    expect(state.portalStatus).toBe('pending');
    expect(state.vendorStatus).toBe('pending');
  });

  it('vendorPortalLayoutCatchState never marks profile missing', () => {
    const state = vendorPortalLayoutCatchState(new Error('RSC exploded'));

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBe('RSC exploded');
  });
});
