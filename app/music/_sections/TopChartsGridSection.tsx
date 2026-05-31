import { TopChartsPageClient } from '@/components/section/music/TopChartsPageClient';
import type { ChartSong } from '@/components/section/music/TopMusicCharts';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToChartSong } from '@/lib/utils/publicApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';

interface TopChartsGridSectionProps {
  category: string;
  period: string;
  page: number;
}

export async function TopChartsGridSection({ category, period, page }: TopChartsGridSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: {
      type: MUSIC_TYPES.charts,
      period,
      category: category && category !== 'all' ? category : undefined,
    },
  }) as `?${string}`;
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
      pagination={res.data?.pagination ?? null}
    />
  );
}
