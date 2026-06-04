import { Suspense } from 'react';
import { ArtistPortalSettingsPageClient } from '@/components/section/account/artist-portal/ArtistPortalSettingsPageClient';
import { ArtistPortalSettingsPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Artist Portal - Settings',
  description: 'Update your artist profile and settings.',
};

export default function ArtistPortalSettingsPage() {
  return (
    <Suspense fallback={<ArtistPortalSettingsPageSkeleton />}>
      <ArtistSettingsPageClientServer />
    </Suspense>
  );
}

async function ArtistSettingsPageClientServer() {
  const res = await callServerApi('ARTIST_GET_ME', {});

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <ArtistPortalSettingsPageClient
        initialArtist={null}
        initialLoadError={res.message || "We couldn't load your artist profile."}
      />
    );
  }

  return (
    <ArtistPortalSettingsPageClient
      initialArtist={res.data.artist}
      initialLoadError={null}
      portalStatus={res.data.portalStatus}
    />
  );
}
