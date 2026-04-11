import { Suspense } from 'react';
import { ArtistPortalUploadPageClient } from '@/components/section/account/artist-portal/ArtistPortalUploadPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Artist Portal - Submit content',
  description: 'Contact the team on WhatsApp to submit music and videos for publishing.',
};

function ArtistUploadSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <Skeleton className="h-8 w-48 rounded-md" />
      <Skeleton className="h-4 w-64 rounded-md" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export default function ArtistPortalUploadPage() {
  return (
    <Suspense fallback={<ArtistUploadSkeleton />}>
      <ArtistUploadPageServer />
    </Suspense>
  );
}

async function ArtistUploadPageServer() {
  const meRes = await callServerApi('ARTIST_GET_ME', {});

  if (meRes.type === 'error' || !meRes.data) {
    const responseCode = (meRes.error as ApiErrorResponse | undefined)?.responseCode;
    const hasArtistProfile = responseCode !== 403 && responseCode !== 404;
    return (
      <ArtistPortalUploadPageClient
        initialHasArtistProfile={hasArtistProfile}
        initialLoadError={meRes.error?.message ?? 'Unable to load artist profile.'}
      />
    );
  }

  return <ArtistPortalUploadPageClient initialHasArtistProfile={true} initialLoadError={null} />;
}
