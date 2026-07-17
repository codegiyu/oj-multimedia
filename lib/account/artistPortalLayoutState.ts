import type { IArtistMeRes } from '@/lib/constants/endpoints';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import {
  isDeferredPortalAuthResponse,
  portalLayoutCaughtErrorMessage,
  portalLayoutLoadError,
} from '@/lib/account/portalLayoutGate';

export const ARTIST_PORTAL_LOAD_ERROR_FALLBACK = 'Unable to load artist profile.';

export type ArtistPortalMeResult =
  | { type: 'success'; data?: IArtistMeRes; message?: string }
  | {
      type: 'error';
      message?: string;
      error?: { responseCode?: number } | null;
    };

export type ArtistPortalLayoutGateState = {
  profileMissing: boolean;
  loadError: string | null;
  authDeferred: boolean;
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
};

const neutralArtistGateMeta: IRolePortalMeta = {
  portalStatus: 'none',
  openAppeal: null,
  lastRejectedAppeal: null,
};

export function artistPortalMetaFromMe(data: IArtistMeRes | undefined): {
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
} {
  if (!data) {
    return {
      portalStatus: 'none',
      meta: neutralArtistGateMeta,
    };
  }

  const portalStatus = (data.portalStatus ?? 'active') as RolePortalStatus;

  return {
    portalStatus,
    meta: {
      portalStatus,
      statusChangedAt: data.statusChangedAt,
      suspensionReason: data.suspensionReason,
      openAppeal: data.openAppeal ?? null,
      lastRejectedAppeal: data.lastRejectedAppeal ?? null,
    },
  };
}

/**
 * Pure mapping from ARTIST_GET_ME result → route-gate props.
 * Keeps artist layout fail-soft and unit-testable without RSC.
 */
export function buildArtistPortalLayoutGateState(
  meRes: ArtistPortalMeResult
): ArtistPortalLayoutGateState {
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;

  if (meRes.type === 'error' && isDeferredPortalAuthResponse(code)) {
    return {
      profileMissing: false,
      loadError: null,
      authDeferred: true,
      portalStatus: 'none',
      meta: neutralArtistGateMeta,
    };
  }

  const meData = meRes.type === 'success' ? meRes.data : undefined;
  const artistId =
    meData?.artist && typeof meData.artist === 'object'
      ? (meData.artist as { _id?: string })._id
      : undefined;

  const profileMissing =
    (meRes.type === 'error' && (code === 403 || code === 404)) ||
    (meRes.type === 'success' && !artistId);

  const { portalStatus, meta } = artistPortalMetaFromMe(meData);

  const loadError = portalLayoutLoadError(
    meRes.type === 'error',
    code,
    meRes.type === 'error' ? meRes.message : undefined,
    ARTIST_PORTAL_LOAD_ERROR_FALLBACK
  );

  return {
    profileMissing,
    loadError,
    authDeferred: false,
    portalStatus,
    meta,
  };
}

/** Fallback gate state when the artist layout body throws unexpectedly. */
export function artistPortalLayoutCatchState(error: unknown): ArtistPortalLayoutGateState {
  if (error instanceof Error && error.message.trim()) {
    console.error('artist portal layout gate:', error.message);
  } else {
    console.error('artist portal layout gate:', portalLayoutCaughtErrorMessage(error, 'unknown'));
  }

  return {
    profileMissing: false,
    loadError: ARTIST_PORTAL_LOAD_ERROR_FALLBACK,
    authDeferred: false,
    portalStatus: 'none',
    meta: neutralArtistGateMeta,
  };
}
