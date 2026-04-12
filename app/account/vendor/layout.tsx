import type { ReactNode } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import type { IVendorMeRes } from '@/lib/constants/endpoints';
import { VendorDashboardLayoutClient } from './VendorDashboardLayoutClient';
import { VendorPortalRouteGate } from '@/components/section/account/vendor/VendorPortalRouteGate';

export default async function VendorLayout({ children }: { children: ReactNode }) {
  const meRes = await callServerApi('VENDOR_GET_ME', {});
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;
  const vendorId =
    meRes.type === 'success' ? (meRes.data as IVendorMeRes | undefined)?._id : undefined;

  const profileMissing =
    (meRes.type === 'error' && (code === 403 || code === 404)) ||
    (meRes.type === 'success' && !vendorId);

  const loadError =
    meRes.type === 'error' && code !== 403 && code !== 404
      ? (meRes.message ?? 'Unable to load vendor profile.')
      : null;

  return (
    <VendorDashboardLayoutClient>
      <VendorPortalRouteGate initialProfileMissing={profileMissing} initialLoadError={loadError}>
        {children}
      </VendorPortalRouteGate>
    </VendorDashboardLayoutClient>
  );
}
