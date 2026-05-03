import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingSongsPageClient } from '@/components/section/music/TrendingSongsPageClient';
import { MusicPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import type { TrendingSong } from '@/components/section/music/TrendingSongs';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterByCategory } from '@/lib/utils/music';
import { mapPublicMusicToTrendingSong } from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Trending Songs - Latest Music',
  description:
    "Discover what's trending now - the most popular songs everyone is listening to. Stay ahead of the music scene.",
};


async function fetchTrendingSongs(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query = `?limit=50&page=1&status=published&type=trending${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', { query });
  if (res.type === 'error') {
    return {
      trendingSongs: [] as (TrendingSong & { category?: string })[],
      initialErrorMessage: res.error?.message ?? 'Failed to load trending songs',
    };
  }

  const raw = res.data?.music ?? [];
  const trendingSongs = filterByCategory(
    raw.map(mapPublicMusicToTrendingSong),
    category
  ) as (TrendingSong & { category?: string })[];
  return { trendingSongs, initialErrorMessage: null as string | null };
}

interface TrendingSongsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingSongsPage({ searchParams }: TrendingSongsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

  return (
    <MainLayout>
      <SubPageHero
        title="Trending Songs"
        titleHighlight="Trending"
        description="Discover what's hot right now - the most popular songs everyone is listening to. Stay ahead of the music scene."
        badgeText="What's Hot"
        badgeIcon="Flame"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }]}
      />
      <Suspense fallback={<MusicPageSkeleton />}>
        <TrendingSongsServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function TrendingSongsServer({ category }: { category: string }) {
  const data = await fetchTrendingSongs(category);
  return <TrendingSongsPageClient {...data} />;
}
