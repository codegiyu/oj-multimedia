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
import {
  artistPortalLayoutCatchState,
  buildArtistPortalLayoutGateState,
} from './artistPortalLayoutState';
import {
  buildPastorPortalLayoutGateState,
  pastorPortalLayoutCatchState,
} from './pastorPortalLayoutState';

describe('portalLayoutGate', () => {
  it('treats prefetch 204 as deferred, not a load error', () => {
    expect(isDeferredPortalAuthResponse(204)).toBe(true);
    expect(portalLayoutLoadError(true, 204, 'Skipped prefetch', 'fallback')).toBeNull();
  });

  it('returns fallback for 5xx errors without leaking upstream message', () => {
    expect(portalLayoutLoadError(true, 500, 'Server error', 'fallback')).toBe('fallback');
    expect(portalLayoutLoadError(true, undefined, 'Unknown', 'fallback')).toBe('fallback');
  });

  it('returns message for client errors', () => {
    expect(portalLayoutLoadError(true, 401, 'Unauthorized', 'fallback')).toBe('Unauthorized');
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
    expect(state.authDeferred).toBe(false);
  });

  it('treats prefetch 204 as auth deferred without operational status', () => {
    const state = buildVendorPortalLayoutGateState({
      type: 'error',
      message: 'Skipped auth upstream call during speculative prefetch',
      error: { responseCode: 204 },
    });

    expect(state.authDeferred).toBe(true);
    expect(state.loadError).toBeNull();
    expect(state.profileMissing).toBe(false);
    expect(state.portalStatus).toBe('none');
  });

  it('surfaces 500 as generic load error, not profile missing', () => {
    const state = buildVendorPortalLayoutGateState({
      type: 'error',
      message: 'Upstream failed',
      error: { responseCode: 500 },
    });

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBe('Unable to load vendor profile.');
    expect(state.authDeferred).toBe(false);
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
    expect(state.authDeferred).toBe(false);
    expect(state.portalStatus).toBe('pending');
    expect(state.vendorStatus).toBe('pending');
    expect(state.storeName).toBe('Store');
  });

  it('vendorPortalLayoutCatchState never marks profile missing or leaks error text', () => {
    const state = vendorPortalLayoutCatchState(new Error('RSC exploded'));

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBe('Unable to load vendor profile.');
    expect(state.authDeferred).toBe(false);
  });
});

describe('buildArtistPortalLayoutGateState', () => {
  it('treats 403/404 as profile missing without load error', () => {
    const state = buildArtistPortalLayoutGateState({
      type: 'error',
      message: 'No artist',
      error: { responseCode: 403 },
    });

    expect(state.profileMissing).toBe(true);
    expect(state.loadError).toBeNull();
    expect(state.authDeferred).toBe(false);
  });

  it('treats prefetch 204 as auth deferred without operational status', () => {
    const state = buildArtistPortalLayoutGateState({
      type: 'error',
      message: 'Skipped auth upstream call during speculative prefetch',
      error: { responseCode: 204 },
    });

    expect(state.authDeferred).toBe(true);
    expect(state.loadError).toBeNull();
    expect(state.profileMissing).toBe(false);
    expect(state.portalStatus).toBe('none');
  });

  it('surfaces 500 as generic load error, not profile missing', () => {
    const state = buildArtistPortalLayoutGateState({
      type: 'error',
      message: 'Upstream failed',
      error: { responseCode: 500 },
    });

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBe('Unable to load artist profile.');
    expect(state.authDeferred).toBe(false);
    expect(state.portalStatus).toBe('none');
  });

  it('maps successful artist me payload', () => {
    const state = buildArtistPortalLayoutGateState({
      type: 'success',
      data: {
        artist: { _id: 'a1', name: 'Artist', slug: 'artist' },
        portalStatus: 'active',
      } as never,
    });

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBeNull();
    expect(state.authDeferred).toBe(false);
    expect(state.portalStatus).toBe('active');
  });

  it('artistPortalLayoutCatchState never marks profile missing or leaks error text', () => {
    const state = artistPortalLayoutCatchState(new Error('RSC exploded'));

    expect(state.profileMissing).toBe(false);
    expect(state.loadError).toBe('Unable to load artist profile.');
    expect(state.authDeferred).toBe(false);
    expect(state.portalStatus).toBe('none');
  });
});

describe('buildPastorPortalLayoutGateState', () => {
  it('treats prefetch 204 as auth deferred without inventing approved', () => {
    const state = buildPastorPortalLayoutGateState({
      type: 'error',
      message: 'Skipped auth upstream call during speculative prefetch',
      error: { responseCode: 204 },
    });

    expect(state.authDeferred).toBe(true);
    expect(state.loadError).toBeNull();
    expect(state.portalState).toBe('none');
    expect(state.application).toBeNull();
  });

  it('surfaces 500 as generic load error with none portal state', () => {
    const state = buildPastorPortalLayoutGateState({
      type: 'error',
      message: 'Upstream failed',
      error: { responseCode: 500 },
    });

    expect(state.loadError).toBe('Unable to load pastor portal.');
    expect(state.authDeferred).toBe(false);
    expect(state.portalState).toBe('none');
  });

  it('maps successful pastor me payload without inventing approved', () => {
    const state = buildPastorPortalLayoutGateState({
      type: 'success',
      data: {
        portalState: 'pending',
        pastor: null,
        application: {
          _id: 'app1',
          status: 'pending',
          name: 'Pastor Applicant',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      },
    });

    expect(state.loadError).toBeNull();
    expect(state.authDeferred).toBe(false);
    expect(state.portalState).toBe('pending');
    expect(state.application?._id).toBe('app1');
  });

  it('pastorPortalLayoutCatchState never invents approved or leaks error text', () => {
    const state = pastorPortalLayoutCatchState(new Error('RSC exploded'));

    expect(state.loadError).toBe('Unable to load pastor portal.');
    expect(state.authDeferred).toBe(false);
    expect(state.portalState).toBe('none');
    expect(state.application).toBeNull();
  });
});
