import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingSongsPageClient } from '@/components/section/music/TrendingSongsPageClient';
import { MusicPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import { filterByCategory } from '@/lib/utils/music';
import type { TrendingSong } from '@/components/section/music/TrendingSongs';
import { MUSIC_ITEMS } from '@/lib/constants/music';

export const metadata: Metadata = {
  title: 'Trending Songs - Latest Music',
  description:
    "Discover what's trending now - the most popular songs everyone is listening to. Stay ahead of the music scene.",
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate trending songs data from central constants
async function generateTrendingSongsData(): Promise<{
  trendingSongs: (TrendingSong & { category: string })[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const trendingSongs: (TrendingSong & { category: string })[] = MUSIC_ITEMS.filter(
    item => item.isTrending && item.plays !== undefined && item.duration !== undefined
  ).map(item => ({
    _id: item._id,
    title: item.title,
    artist: item.artist,
    cover: item.cover,
    plays: item.plays!,
    duration: item.duration!,
    isNew: item.isNew || false,
    category: item.category, // category is required in MusicItem, so this is always a string
  }));

  return {
    trendingSongs,
  };
}

interface TrendingSongsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingSongsPage({ searchParams }: TrendingSongsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateTrendingSongsData();

  // Filter data server-side based on category
  const filteredData = {
    trendingSongs: filterByCategory(data.trendingSongs, category),
  };

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
        <TrendingSongsPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
