import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TopChartsPageClient } from '@/components/section/music/TopChartsPageClient';
import { MusicPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import type { ChartSong } from '@/components/section/music/TopMusicCharts';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterByCategory } from '@/lib/utils/music';
import { filterPublicMusicList, mapPublicMusicToChartSong } from '@/lib/utils/publicApiMappers';
import { CHART_PERIOD_VALUES, MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { musicCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';

export const metadata: Metadata = {
  title: 'Top Charts - Music Rankings',
  description:
    'View the top music charts across all genres. See what songs are ranking highest this week, month, or all-time.',
};

async function fetchChartSongs(category: string, period: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=100&page=1&status=published&type=${MUSIC_TYPES.charts}&period=${encodeURIComponent(period)}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', { query });
  if (res.type === 'error') {
    return {
      chartSongs: [] as (ChartSong & { category?: string })[],
      initialErrorMessage: res.error?.message ?? 'Failed to load charts',
    };
  }

  const raw = filterPublicMusicList(res.data?.music ?? []);
  const chartSongs = filterByCategory(
    raw.map((item, i) => mapPublicMusicToChartSong(item, i + 1)),
    category
  ) as (ChartSong & { category?: string })[];
  return { chartSongs, initialErrorMessage: null as string | null };
}

interface TopChartsPageProps {
  searchParams: Promise<{ category?: string; period?: string }>;
}

export default async function TopChartsPage({ searchParams }: TopChartsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('music', params.category);
  const period = CHART_PERIOD_VALUES.includes(
    (params.period ?? 'weekly') as (typeof CHART_PERIOD_VALUES)[number]
  )
    ? (params.period ?? 'weekly')
    : 'weekly';

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
        <TopChartsServer category={category} period={period} />
      </Suspense>
    </MainLayout>
  );
}

async function TopChartsServer({ category, period }: { category: string; period: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchChartSongs(category, period),
    fetchPublicCategoryNav('music', 'All Genres', musicCategoryNavFallback),
  ]);

  return <TopChartsPageClient {...data} categoryOptions={categoryOptions} period={period} />;
}
