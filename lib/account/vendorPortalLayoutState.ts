import type { IMarketplaceVendor, IVendorMeRes } from '@/lib/constants/endpoints';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import {
  portalLayoutCaughtErrorMessage,
  portalLayoutLoadError,
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
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
  vendorStatus: string | undefined;
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
  const vendor = meRes.type === 'success' ? meRes.data : undefined;
  const vendorId = vendor?._id;

  const profileMissing =
    (meRes.type === 'error' && (code === 403 || code === 404)) ||
    (meRes.type === 'success' && !vendorId);

  const { portalStatus, meta } = vendorPortalMetaFromApi(vendor);
  const vendorStatus =
    (vendor?.portalStatus as string | undefined) ?? (vendor?.status as string | undefined);

  const loadError = portalLayoutLoadError(
    meRes.type === 'error',
    code,
    meRes.type === 'error' ? meRes.message : undefined,
    'Unable to load vendor profile.'
  );

  return {
    profileMissing,
    loadError,
    portalStatus,
    meta,
    vendorStatus,
  };
}

/** Fallback gate state when the vendor layout body throws unexpectedly. */
export function vendorPortalLayoutCatchState(error: unknown): VendorPortalLayoutGateState {
  return {
    profileMissing: false,
    loadError: portalLayoutCaughtErrorMessage(error, 'Unable to load vendor profile.'),
    portalStatus: 'active',
    meta: { portalStatus: 'active', openAppeal: null, lastRejectedAppeal: null },
    vendorStatus: undefined,
  };
}
