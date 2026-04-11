import { Suspense } from 'react';
import { ArtistPortalMusicPageClient } from '@/components/section/account/artist-portal/ArtistPortalMusicPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

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

export default function ArtistPortalMusicPage({
  searchParams,
}: {
  searchParams?: { page?: string; pagesize?: string; status?: string };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;
  const status = searchParams?.status ?? '';

  return (
    <Suspense fallback={<ArtistMusicPageSkeleton />}>
      <ArtistMusicPageClientServer page={page} pageSize={pageSize} status={status} />
    </Suspense>
  );
}

async function ArtistMusicPageClientServer({
  page,
  pageSize,
  status,
}: {
  page: number;
  pageSize: number;
  status: string;
}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(pageSize));
  if (status) params.set('status', status);
  const query = `?${params.toString()}` as const;

  const res = await callServerApi('ARTIST_GET_MUSIC', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return (
        <ArtistPortalMusicPageClient
          initialMusic={[]}
          initialTotalPages={1}
          initialHasArtistProfile={false}
          initialErrorMessage={null}
        />
      );
    }

    return (
      <ArtistPortalMusicPageClient
        initialMusic={[]}
        initialTotalPages={1}
        initialHasArtistProfile={true}
        initialErrorMessage={res.message || 'Unable to load music.'}
      />
    );
  }

  return (
    <ArtistPortalMusicPageClient
      initialMusic={res.data.music}
      initialTotalPages={res.data.pagination?.totalPages ?? 1}
      initialHasArtistProfile={true}
      initialErrorMessage={null}
    />
  );
}
