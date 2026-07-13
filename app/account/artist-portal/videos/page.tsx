import { Suspense } from 'react';
import { ArtistPortalVideosPageClient } from '@/components/section/account/artist-portal/ArtistPortalVideosPageClient';
import { ArtistPortalContentListPageSkeleton } from '@/components/section/account/skeletons';
import { DashboardPortalForbiddenFallback } from '@/components/section/account/shared/DashboardPortalForbiddenFallback';
import type { Metadata } from 'next';
import { buildAccountArtistContentQuery } from '@/lib/account/accountListFilters';
import { isPortalForbiddenCode } from '@/lib/account/rolePortalAccess';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import { parseAccountListPageParams } from '@/lib/utils/accountSearchParams';

export const metadata: Metadata = {
  title: 'Artist Portal - Videos',
  description: 'Manage your video content.',
};

interface ArtistPortalVideosPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ArtistPortalVideosPage({ searchParams }: ArtistPortalVideosPageProps) {
  return (
    <Suspense fallback={<ArtistPortalContentListPageSkeleton />}>
      <ArtistVideosPageClientServer searchParams={searchParams} />
    </Suspense>
  );
}

async function ArtistVideosPageClientServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const { page, pageSize, status, search } = parseAccountListPageParams(raw);
  const query =
    `?${buildAccountArtistContentQuery({ page, pageSize, status, search }).toString()}` as const;

  const res = await callServerApi('ARTIST_GET_VIDEOS', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (isPortalForbiddenCode(responseCode)) {
      return <DashboardPortalForbiddenFallback message={res.message || 'Unable to load videos.'} />;
    }

    return (
      <ArtistPortalVideosPageClient
        initialVideos={[]}
        initialTotalPages={1}
        initialErrorMessage={res.message || 'Unable to load videos.'}
      />
    );
  }

  return (
    <ArtistPortalVideosPageClient
      initialVideos={res.data.videos}
      initialTotalPages={res.data.pagination?.totalPages ?? 1}
      initialErrorMessage={null}
    />
  );
}
