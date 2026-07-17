import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { PastorPortalLayoutClient } from './PastorPortalLayoutClient';
import { PastorPortalRouteGate } from '@/components/section/account/pastor-portal/PastorPortalRouteGate';
import {
  buildPastorPortalLayoutGateState,
  pastorPortalLayoutCatchState,
} from '@/lib/account/pastorPortalLayoutState';

export const dynamic = 'force-dynamic';

async function PastorPortalLayoutGate({ children }: { children: ReactNode }) {
  let gateState;

  try {
    const meRes = await callServerApi('PASTOR_GET_ME', {});
    gateState = buildPastorPortalLayoutGateState(meRes);
  } catch (error) {
    gateState = pastorPortalLayoutCatchState(error);
  }

  return (
    <PastorPortalRouteGate
      initialPortalState={gateState.portalState}
      initialApplication={gateState.application}
      initialLoadError={gateState.loadError}
      initialAuthDeferred={gateState.authDeferred}
      initialMeta={gateState.meta}>
      {children}
    </PastorPortalRouteGate>
  );
}

export default function PastorPortalLayout({ children }: { children: ReactNode }) {
  return (
    <PastorPortalLayoutClient>
      <Suspense fallback={<DashboardMainSkeleton />}>
        <PastorPortalLayoutGate>{children}</PastorPortalLayoutGate>
      </Suspense>
    </PastorPortalLayoutClient>
  );
}
