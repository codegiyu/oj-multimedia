import { Suspense } from 'react';
import { ArtistPortalMusicPageClient } from '@/components/section/account/artist-portal/ArtistPortalMusicPageClient';
import { ArtistPortalContentListPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { buildAccountArtistContentQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import { parseAccountListPageParams } from '@/lib/utils/accountSearchParams';

export const metadata: Metadata = {
  title: 'Artist Portal - Music',
  description: 'Manage your music releases and tracks.',
};

interface ArtistPortalMusicPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ArtistPortalMusicPage({ searchParams }: ArtistPortalMusicPageProps) {
  return (
    <Suspense fallback={<ArtistPortalContentListPageSkeleton />}>
      <ArtistMusicPageServer searchParams={searchParams} />
    </Suspense>
  );
}

async function ArtistMusicPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const { page, pageSize, search, status } = parseAccountListPageParams(raw);
  const query =
    `?${buildAccountArtistContentQuery({ page, pageSize, status, search }).toString()}` as const;

  const res = await callServerApi('ARTIST_GET_MUSIC', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <ArtistPortalMusicPageClient
        initialMusic={[]}
        initialTotalPages={1}
        initialErrorMessage={res.message || 'Unable to load music.'}
      />
    );
  }

  return (
    <ArtistPortalMusicPageClient
      initialMusic={res.data.music}
      initialTotalPages={res.data.pagination?.totalPages ?? 1}
      initialErrorMessage={null}
    />
  );
}
