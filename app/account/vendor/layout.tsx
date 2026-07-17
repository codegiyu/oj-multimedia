import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { VendorDashboardLayoutClient } from './VendorDashboardLayoutClient';
import { VendorPortalRouteGate } from '@/components/section/account/vendor/VendorPortalRouteGate';
import {
  buildVendorPortalLayoutGateState,
  vendorPortalLayoutCatchState,
} from '@/lib/account/vendorPortalLayoutState';

export const dynamic = 'force-dynamic';

async function VendorPortalShellAndGate({ children }: { children: ReactNode }) {
  let gateState;

  try {
    const meRes = await callServerApi('VENDOR_GET_ME', {});
    gateState = buildVendorPortalLayoutGateState(meRes);
  } catch (error) {
    gateState = vendorPortalLayoutCatchState(error);
  }

  return (
    <VendorDashboardLayoutClient
      vendorStatus={gateState.vendorStatus}
      storeName={gateState.storeName}
      skipMeFetch>
      <VendorPortalRouteGate
        initialProfileMissing={gateState.profileMissing}
        initialLoadError={gateState.loadError}
        initialAuthDeferred={gateState.authDeferred}
        initialPortalStatus={gateState.portalStatus}
        initialMeta={gateState.meta}>
        {children}
      </VendorPortalRouteGate>
    </VendorDashboardLayoutClient>
  );
}

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <VendorDashboardLayoutClient skipMeFetch>
          <DashboardMainSkeleton />
        </VendorDashboardLayoutClient>
      }>
      <VendorPortalShellAndGate>{children}</VendorPortalShellAndGate>
    </Suspense>
  );
}
