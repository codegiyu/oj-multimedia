import type { ReactNode } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { ArtistPortalLayoutClient } from './ArtistPortalLayoutClient';
import {
  ArtistPortalRouteGate,
  artistPortalMetaFromMe,
} from '@/components/section/account/artist-portal/ArtistPortalRouteGate';

export default async function ArtistPortalLayout({ children }: { children: ReactNode }) {
  const meRes = await callServerApi('ARTIST_GET_ME', {});
  const code = meRes.type === 'error' ? meRes.error?.responseCode : undefined;
  const artistId =
    meRes.type === 'success' && meRes.data?.artist && typeof meRes.data.artist === 'object'
      ? (meRes.data.artist as { _id?: string })._id
      : undefined;

  const profileMissing =
    (meRes.type === 'error' && (code === 403 || code === 404)) ||
    (meRes.type === 'success' && !artistId);

  const loadError =
    meRes.type === 'error' && code !== 403 && code !== 404
      ? (meRes.message ?? 'Unable to load artist profile.')
      : null;

  const meData = meRes.type === 'success' ? meRes.data : undefined;
  const { portalStatus, meta } = artistPortalMetaFromMe(meData);

  return (
    <ArtistPortalLayoutClient>
      <ArtistPortalRouteGate
        initialProfileMissing={profileMissing}
        initialLoadError={loadError}
        initialPortalStatus={portalStatus}
        initialMeta={meta}>
        {children}
      </ArtistPortalRouteGate>
    </ArtistPortalLayoutClient>
  );
}
