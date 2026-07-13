import { Suspense } from 'react';
import { ArtistPortalUploadPageClient } from '@/components/section/account/artist-portal/ArtistPortalUploadPageClient';
import { ArtistPortalUploadPageSkeleton } from '@/components/section/account/skeletons';
import { DashboardPortalForbiddenFallback } from '@/components/section/account/shared/DashboardPortalForbiddenFallback';
import type { Metadata } from 'next';
import { isPortalForbiddenCode } from '@/lib/account/rolePortalAccess';
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

    if (isPortalForbiddenCode(responseCode)) {
      return (
        <DashboardPortalForbiddenFallback
          message={meRes.error?.message ?? 'Unable to load artist profile.'}
        />
      );
    }

    return (
      <ArtistPortalUploadPageClient
        initialLoadError={meRes.error?.message ?? 'Unable to load artist profile.'}
      />
    );
  }

  return <ArtistPortalUploadPageClient initialLoadError={null} />;
}
