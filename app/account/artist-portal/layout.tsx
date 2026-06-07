import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { portalLayoutLoadError } from '@/lib/account/portalLayoutGate';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { ArtistPortalLayoutClient } from './ArtistPortalLayoutClient';
import {
  ArtistPortalRouteGate,
  artistPortalMetaFromMe,
} from '@/components/section/account/artist-portal/ArtistPortalRouteGate';

export const dynamic = 'force-dynamic';

async function ArtistPortalLayoutGate({ children }: { children: ReactNode }) {
  const meRes = await callServerApi('ARTIST_GET_ME', {});
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;
  const artistId =
    meRes.type === 'success' && meRes.data?.artist && typeof meRes.data.artist === 'object'
      ? (meRes.data.artist as { _id?: string })._id
      : undefined;

  const profileMissing =
    (meRes.type === 'error' && (code === 403 || code === 404)) ||
    (meRes.type === 'success' && !artistId);

  const loadError = portalLayoutLoadError(
    meRes.type === 'error',
    code,
    meRes.type === 'error' ? meRes.message : undefined,
    'Unable to load artist profile.'
  );

  const meData = meRes.type === 'success' ? meRes.data : undefined;
  const { portalStatus, meta } = artistPortalMetaFromMe(meData);

  return (
    <ArtistPortalRouteGate
      initialProfileMissing={profileMissing}
      initialLoadError={loadError}
      initialPortalStatus={portalStatus}
      initialMeta={meta}>
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
