import { Suspense } from 'react';
import { ArtistPortalMusicPageClient } from '@/components/section/account/artist-portal/ArtistPortalMusicPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { buildAccountArtistContentQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import { parseAccountListPageParams } from '@/lib/utils/accountSearchParams';

export const metadata: Metadata = {
  title: 'Artist Portal - Music',
  description: 'Manage your music releases and tracks.',
};

function ArtistMusicPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-40 rounded-md" />
      <Skeleton className="h-10 w-48 rounded-md" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

interface ArtistPortalMusicPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ArtistPortalMusicPage({ searchParams }: ArtistPortalMusicPageProps) {
  return (
    <Suspense fallback={<ArtistMusicPageSkeleton />}>
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
