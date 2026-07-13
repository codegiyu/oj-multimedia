import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import type { IVendorMeRes } from '@/lib/constants/endpoints';
import { portalLayoutLoadError } from '@/lib/account/portalLayoutGate';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { VendorDashboardLayoutClient } from './VendorDashboardLayoutClient';
import {
  VendorPortalRouteGate,
  vendorPortalMetaFromApi,
} from '@/components/section/account/vendor/VendorPortalRouteGate';

export const dynamic = 'force-dynamic';

async function VendorLayoutBody({ children }: { children: ReactNode }) {
  const meRes = await callServerApi('VENDOR_GET_ME', {});
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;
  const vendor = meRes.type === 'success' ? (meRes.data as IVendorMeRes | undefined) : undefined;
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

  return (
    <VendorDashboardLayoutClient vendorStatus={vendorStatus}>
      <VendorPortalRouteGate
        initialProfileMissing={profileMissing}
        initialLoadError={loadError}
        initialPortalStatus={portalStatus}
        initialMeta={meta}>
        {children}
      </VendorPortalRouteGate>
    </VendorDashboardLayoutClient>
  );
}

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardMainSkeleton />}>
      <VendorLayoutBody>{children}</VendorLayoutBody>
    </Suspense>
  );
}
