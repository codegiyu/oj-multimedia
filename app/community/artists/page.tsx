import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ArtistsPageClient } from '@/components/section/community/artists/ArtistsPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import { mapToCommunityArtist } from '@/lib/utils/communityApiMappers';
import type { Pagination } from '@/lib/types/community';

export const metadata: Metadata = {
  title: 'Artists - Community Creators',
  description:
    'Discover artists and creators. Explore profiles, music, and videos from talented creators in our community.',
};

export const dynamic = 'force-dynamic';

const ARTISTS_LIMIT = 24;

async function fetchArtistsData(page: number): Promise<{
  artists: Array<{
    _id: string;
    name: string;
    image: string;
    genre: string;
    followers: string;
    verified: boolean;
    songs?: number;
  }>;
  pagination: Pagination | null;
  initialErrorMessage: string | null;
}> {
  const res = await callServerApi('PUBLIC_GET_ARTISTS', {
    query: `?limit=${ARTISTS_LIMIT}&page=${page}` as `?${string}`,
  });
  if (res.type === 'error') {
    return {
      artists: [],
      pagination: null,
      initialErrorMessage: res.error?.message ?? 'Failed to load artists',
    };
  }
  const artists = (res.data?.artists ?? []).map(i =>
    mapToCommunityArtist(i as unknown as Record<string, unknown>)
  );
  const pagination = res.data?.pagination ?? null;
  return { artists, pagination, initialErrorMessage: null };
}

interface ArtistsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CommunityArtistsPage({ searchParams }: ArtistsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? '1'), 10) || 1);
  const { artists, pagination, initialErrorMessage } = await fetchArtistsData(page);

  return (
    <MainLayout>
      <SubPageHero
        title="Artists"
        titleHighlight="Artists"
        description="Discover artists and creators. Explore profiles, music, and videos from talented creators in our community."
        badgeText="Community"
        badgeIcon="Users"
        backUrl="/community"
        backLabel="Back to Community"
        stats={[{ icon: 'Users', text: 'Creators' }, { text: 'Music & Videos' }]}
      />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-12 animate-pulse grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" />
        }>
        <ArtistsPageClient
          artists={artists}
          pagination={pagination}
          initialErrorMessage={initialErrorMessage}
        />
      </Suspense>
    </MainLayout>
  );
}
