import type {
  IPastorApplication,
  IPastorMeRes,
  PastorPortalState,
} from '@/lib/constants/endpoints';
import type { IRolePortalMeta } from '@/lib/types/rolePortal';
import {
  isDeferredPortalAuthResponse,
  portalLayoutCaughtErrorMessage,
  portalLayoutLoadError,
} from '@/lib/account/portalLayoutGate';

export const PASTOR_PORTAL_LOAD_ERROR_FALLBACK = 'Unable to load pastor portal.';

export type PastorPortalMeResult =
  | { type: 'success'; data?: IPastorMeRes; message?: string }
  | {
      type: 'error';
      message?: string;
      error?: { responseCode?: number } | null;
    };

export type PastorPortalLayoutGateState = {
  portalState: PastorPortalState;
  application: IPastorApplication | null;
  loadError: string | null;
  authDeferred: boolean;
  meta: IRolePortalMeta;
};

const neutralPastorGateMeta: IRolePortalMeta = {
  portalStatus: 'none',
  openAppeal: null,
  lastRejectedAppeal: null,
};

/**
 * Pure mapping from PASTOR_GET_ME result → route-gate props.
 * Keeps pastor layout fail-soft and unit-testable without RSC.
 */
export function buildPastorPortalLayoutGateState(
  meRes: PastorPortalMeResult
): PastorPortalLayoutGateState {
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;

  if (meRes.type === 'error' && isDeferredPortalAuthResponse(code)) {
    return {
      portalState: 'none',
      application: null,
      loadError: null,
      authDeferred: true,
      meta: neutralPastorGateMeta,
    };
  }

  const data = meRes.type === 'success' ? meRes.data : undefined;

  const loadError = portalLayoutLoadError(
    meRes.type === 'error',
    code,
    meRes.type === 'error' ? meRes.message : undefined,
    PASTOR_PORTAL_LOAD_ERROR_FALLBACK
  );

  const portalState = (data?.portalState ?? 'none') as PastorPortalState;

  return {
    portalState,
    application: data?.application ?? null,
    loadError,
    authDeferred: false,
    meta: {
      portalStatus: (data?.portalStatus ?? data?.portalState) as IRolePortalMeta['portalStatus'],
      statusChangedAt: data?.statusChangedAt,
      suspensionReason: data?.suspensionReason,
      openAppeal: data?.openAppeal ?? null,
      lastRejectedAppeal: data?.lastRejectedAppeal ?? null,
    },
  };
}

/** Fallback gate state when the pastor layout body throws unexpectedly. */
export function pastorPortalLayoutCatchState(error: unknown): PastorPortalLayoutGateState {
  if (error instanceof Error && error.message.trim()) {
    console.error('pastor portal layout gate:', error.message);
  } else {
    console.error('pastor portal layout gate:', portalLayoutCaughtErrorMessage(error, 'unknown'));
  }

  return {
    portalState: 'none',
    application: null,
    loadError: PASTOR_PORTAL_LOAD_ERROR_FALLBACK,
    authDeferred: false,
    meta: neutralPastorGateMeta,
  };
}
