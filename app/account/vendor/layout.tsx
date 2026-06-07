import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import type { IVendorMeRes } from '@/lib/constants/endpoints';
import { VendorDashboardLayoutClient } from './VendorDashboardLayoutClient';
import {
  VendorPortalRouteGate,
  vendorPortalMetaFromApi,
} from '@/components/section/account/vendor/VendorPortalRouteGate';

async function VendorLayoutGate({ children }: { children: ReactNode }) {
  const meRes = await callServerApi('VENDOR_GET_ME', {});
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;
  const vendorId =
    meRes.type === 'success' ? (meRes.data as IVendorMeRes | undefined)?._id : undefined;
  const vendor = meRes.type === 'success' ? (meRes.data as IVendorMeRes | undefined) : undefined;

  const profileMissing =
    (meRes.type === 'error' && (code === 403 || code === 404)) ||
    (meRes.type === 'success' && !vendorId);

  const { portalStatus, meta } = vendorPortalMetaFromApi(vendor);

  const loadError =
    meRes.type === 'error' && code !== 403 && code !== 404
      ? (meRes.message ?? 'Unable to load vendor profile.')
      : null;

  return (
    <VendorPortalRouteGate
      initialProfileMissing={profileMissing}
      initialLoadError={loadError}
      initialPortalStatus={portalStatus}
      initialMeta={meta}>
      {children}
    </VendorPortalRouteGate>
  );
}

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <VendorDashboardLayoutClient>
      <Suspense fallback={null}>
        <VendorLayoutGate>{children}</VendorLayoutGate>
      </Suspense>
    </VendorDashboardLayoutClient>
  );
}
