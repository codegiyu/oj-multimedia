import { Suspense } from 'react';
import { ArtistPortalSettingsPageClient } from '@/components/section/account/artist-portal/ArtistPortalSettingsPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Artist Portal - Settings',
  description: 'Update your artist profile and settings.',
};

function ArtistSettingsPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-48 rounded-md" />
      <Skeleton className="h-4 w-32 rounded-md" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function ArtistPortalSettingsPage() {
  return (
    <Suspense fallback={<ArtistSettingsPageSkeleton />}>
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

  return <ArtistPortalSettingsPageClient initialArtist={res.data.artist} initialLoadError={null} />;
}
