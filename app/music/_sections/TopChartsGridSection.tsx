import { TopChartsPageClient } from '@/components/section/music/TopChartsPageClient';
import type { ChartSong } from '@/components/section/music/TopMusicCharts';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToChartSong } from '@/lib/utils/publicApiMappers';
interface TopChartsGridSectionProps {
  category: string;
  period: string;
}

export async function TopChartsGridSection({ category, period }: TopChartsGridSectionProps) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=100&page=1&status=published&type=${MUSIC_TYPES.charts}&period=${encodeURIComponent(period)}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', { query }, ISR_PUBLIC_FETCH.fast);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Top charts unavailable"
        message={res.error?.message ?? 'Failed to load charts'}
      />
    );
  }

  const chartSongs = (res.data?.music ?? []).map(item =>
    mapPublicMusicToChartSong(item)
  ) as (ChartSong & { category?: string })[];

  return (
    <TopChartsPageClient
      showCategories={false}
      categoryOptions={[]}
      chartSongs={chartSongs}
      period={period}
    />
  );
}
