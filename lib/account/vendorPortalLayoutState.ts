import type { IMarketplaceVendor, IVendorMeRes } from '@/lib/constants/endpoints';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import {
  isDeferredPortalAuthResponse,
  portalLayoutCaughtErrorMessage,
  portalLayoutLoadError,
  VENDOR_PORTAL_LOAD_ERROR_FALLBACK,
} from '@/lib/account/portalLayoutGate';

export type VendorPortalMeResult =
  | { type: 'success'; data?: IVendorMeRes; message?: string }
  | {
      type: 'error';
      message?: string;
      error?: { responseCode?: number } | null;
    };

export type VendorPortalLayoutGateState = {
  profileMissing: boolean;
  loadError: string | null;
  authDeferred: boolean;
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
  vendorStatus: string | undefined;
  storeName: string | undefined;
};

const neutralVendorGateMeta: IRolePortalMeta = {
  portalStatus: 'none',
  openAppeal: null,
  lastRejectedAppeal: null,
};

export function vendorPortalMetaFromApi(vendor: IMarketplaceVendor | undefined): {
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
} {
  const portalStatus = (vendor?.portalStatus ?? vendor?.status ?? 'active') as RolePortalStatus;

  return {
    portalStatus,
    meta: {
      portalStatus,
      statusChangedAt: vendor?.statusChangedAt,
      suspensionReason: vendor?.suspensionReason,
      openAppeal: vendor?.openAppeal ?? null,
      lastRejectedAppeal: vendor?.lastRejectedAppeal ?? null,
    },
  };
}

/**
 * Pure mapping from VENDOR_GET_ME result → route-gate props.
 * Keeps vendor layout fail-soft and unit-testable without RSC.
 */
export function buildVendorPortalLayoutGateState(
  meRes: VendorPortalMeResult
): VendorPortalLayoutGateState {
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;

  if (meRes.type === 'error' && isDeferredPortalAuthResponse(code)) {
    return {
      profileMissing: false,
      loadError: null,
      authDeferred: true,
      portalStatus: 'none',
      meta: neutralVendorGateMeta,
      vendorStatus: undefined,
      storeName: undefined,
    };
  }

  const vendor = meRes.type === 'success' ? meRes.data : undefined;
  const vendorId = vendor?._id;

  const profileMissing =
    (meRes.type === 'error' && (code === 403 || code === 404)) ||
    (meRes.type === 'success' && !vendorId);

  const { portalStatus, meta } = vendorPortalMetaFromApi(vendor);
  const vendorStatus =
    (vendor?.portalStatus as string | undefined) ?? (vendor?.status as string | undefined);
  const storeName = vendor?.storeName?.trim() ? vendor.storeName : undefined;

  const loadError = portalLayoutLoadError(
    meRes.type === 'error',
    code,
    meRes.type === 'error' ? meRes.message : undefined,
    VENDOR_PORTAL_LOAD_ERROR_FALLBACK
  );

  return {
    profileMissing,
    loadError,
    authDeferred: false,
    portalStatus,
    meta,
    vendorStatus,
    storeName,
  };
}

/** Fallback gate state when the vendor layout body throws unexpectedly. */
export function vendorPortalLayoutCatchState(error: unknown): VendorPortalLayoutGateState {
  if (error instanceof Error && error.message.trim()) {
    console.error('vendor portal layout gate:', error.message);
  } else {
    console.error('vendor portal layout gate:', portalLayoutCaughtErrorMessage(error, 'unknown'));
  }

  return {
    profileMissing: false,
    loadError: VENDOR_PORTAL_LOAD_ERROR_FALLBACK,
    authDeferred: false,
    portalStatus: 'none',
    meta: neutralVendorGateMeta,
    vendorStatus: undefined,
    storeName: undefined,
  };
}
