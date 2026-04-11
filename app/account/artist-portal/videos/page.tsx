import { Suspense } from 'react';
import { ArtistPortalVideosPageClient } from '@/components/section/account/artist-portal/ArtistPortalVideosPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Artist Portal - Videos',
  description: 'Manage your video content.',
};

function ArtistVideosPageSkeleton() {
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

export default function ArtistPortalVideosPage({
  searchParams,
}: {
  searchParams?: { page?: string; pagesize?: string; status?: string };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;
  const status = searchParams?.status ?? '';

  return (
    <Suspense fallback={<ArtistVideosPageSkeleton />}>
      <ArtistVideosPageClientServer page={page} pageSize={pageSize} status={status} />
    </Suspense>
  );
}

async function ArtistVideosPageClientServer({
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

  const res = await callServerApi('ARTIST_GET_VIDEOS', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return (
        <ArtistPortalVideosPageClient
          initialVideos={[]}
          initialTotalPages={1}
          initialHasArtistProfile={false}
          initialErrorMessage={null}
        />
      );
    }

    return (
      <ArtistPortalVideosPageClient
        initialVideos={[]}
        initialTotalPages={1}
        initialHasArtistProfile={true}
        initialErrorMessage={res.message || 'Unable to load videos.'}
      />
    );
  }

  return (
    <ArtistPortalVideosPageClient
      initialVideos={res.data.videos}
      initialTotalPages={res.data.pagination?.totalPages ?? 1}
      initialHasArtistProfile={true}
      initialErrorMessage={null}
    />
  );
}
