import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TopChartsPageClient } from '@/components/section/music/TopChartsPageClient';
import { MusicPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import { filterByCategory } from '@/lib/utils/music';
import type { ChartSong } from '@/components/section/music/TopMusicCharts';
import { MUSIC_ITEMS } from '@/lib/constants/music';

export const metadata: Metadata = {
  title: 'Top Charts - Music Rankings',
  description:
    'View the top music charts across all genres. See what songs are ranking highest this week, month, or all-time.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate chart songs data from central constants
async function generateChartSongsData(period: string = 'weekly') {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const chartSongs: (ChartSong & { category: string })[] = MUSIC_ITEMS.filter(
    item =>
      item.isChart &&
      item.rank !== undefined &&
      item.trend !== undefined &&
      (item.chartPeriod || 'weekly') === period
  )
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .map(item => ({
      id: item.id,
      rank: item.rank!,
      title: item.title,
      artist: item.artist,
      cover: item.cover,
      plays: item.plays || '0',
      trend: item.trend!,
      change: item.change || 0,
      category: item.category, // category is required in MusicItem, so this is always a string
    }));

  return {
    chartSongs,
  };
}

interface TopChartsPageProps {
  searchParams: Promise<{ category?: string; period?: string }>;
}

export default async function TopChartsPage({ searchParams }: TopChartsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const period = params.period || 'weekly';
  const data = await generateChartSongsData(period);

  // Filter data server-side based on category
  const filteredData = {
    chartSongs: filterByCategory(data.chartSongs, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Top Charts"
        titleHighlight="Top"
        description="View the top music charts across all genres. See what songs are ranking highest this week, month, or all-time."
        badgeText="Charts"
        badgeIcon="Trophy"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[
          { icon: 'Trophy', text: 'Top rankings' },
          {
            text:
              period === 'weekly'
                ? 'Weekly updates'
                : period === 'monthly'
                  ? 'Monthly updates'
                  : 'All-time rankings',
          },
        ]}
      />
      <Suspense fallback={<MusicPageSkeleton />}>
        <TopChartsPageClient {...filteredData} period={period} />
      </Suspense>
    </MainLayout>
  );
}
