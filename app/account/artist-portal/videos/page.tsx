import { Suspense } from 'react';
import { ArtistPortalVideosPageClient } from '@/components/section/account/artist-portal/ArtistPortalVideosPageClient';
import { ArtistPortalContentListPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { buildAccountArtistContentQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Artist Portal - Videos',
  description: 'Manage your video content.',
};

export default function ArtistPortalVideosPage({
  searchParams,
}: {
  searchParams?: { page?: string; pagesize?: string; status?: string; search?: string };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;
  const status = searchParams?.status ?? '';
  const search = searchParams?.search ?? '';

  return (
    <Suspense fallback={<ArtistPortalContentListPageSkeleton />}>
      <ArtistVideosPageClientServer
        page={page}
        pageSize={pageSize}
        status={status}
        search={search}
      />
    </Suspense>
  );
}

async function ArtistVideosPageClientServer({
  page,
  pageSize,
  status,
  search,
}: {
  page: number;
  pageSize: number;
  status: string;
  search: string;
}) {
  const query =
    `?${buildAccountArtistContentQuery({ page, pageSize, status, search }).toString()}` as const;

  const res = await callServerApi('ARTIST_GET_VIDEOS', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
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
