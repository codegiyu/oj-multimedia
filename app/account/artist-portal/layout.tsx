import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { ArtistPortalLayoutClient } from './ArtistPortalLayoutClient';
import { ArtistPortalRouteGate } from '@/components/section/account/artist-portal/ArtistPortalRouteGate';
import {
  buildArtistPortalLayoutGateState,
  artistPortalLayoutCatchState,
} from '@/lib/account/artistPortalLayoutState';

export const dynamic = 'force-dynamic';

async function ArtistPortalLayoutGate({ children }: { children: ReactNode }) {
  let gateState;

  try {
    const meRes = await callServerApi('ARTIST_GET_ME', {});
    gateState = buildArtistPortalLayoutGateState(meRes);
  } catch (error) {
    gateState = artistPortalLayoutCatchState(error);
  }

  return (
    <ArtistPortalRouteGate
      initialProfileMissing={gateState.profileMissing}
      initialLoadError={gateState.loadError}
      initialAuthDeferred={gateState.authDeferred}
      initialPortalStatus={gateState.portalStatus}
      initialMeta={gateState.meta}>
      {children}
    </ArtistPortalRouteGate>
  );
}

export default function ArtistPortalLayout({ children }: { children: ReactNode }) {
  return (
    <ArtistPortalLayoutClient>
      <Suspense fallback={<DashboardMainSkeleton />}>
        <ArtistPortalLayoutGate>{children}</ArtistPortalLayoutGate>
      </Suspense>
    </ArtistPortalLayoutClient>
  );
}
