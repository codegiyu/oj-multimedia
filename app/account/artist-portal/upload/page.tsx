import { Suspense } from 'react';
import { ArtistPortalUploadPageClient } from '@/components/section/account/artist-portal/ArtistPortalUploadPageClient';
import { ArtistPortalUploadPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Artist Portal - Submit content',
  description: 'Contact the team on WhatsApp to submit music and videos for publishing.',
};

export default function ArtistPortalUploadPage() {
  return (
    <Suspense fallback={<ArtistPortalUploadPageSkeleton />}>
      <ArtistUploadPageServer />
    </Suspense>
  );
}

async function ArtistUploadPageServer() {
  const meRes = await callServerApi('ARTIST_GET_ME', {});

  if (meRes.type === 'error' || !meRes.data) {
    const responseCode = (meRes.error as ApiErrorResponse | undefined)?.responseCode;
    if (responseCode === 403 || responseCode === 404) {
      return null;
    }
    return (
      <ArtistPortalUploadPageClient
        initialLoadError={meRes.error?.message ?? 'Unable to load artist profile.'}
      />
    );
  }

  return <ArtistPortalUploadPageClient initialLoadError={null} />;
}
