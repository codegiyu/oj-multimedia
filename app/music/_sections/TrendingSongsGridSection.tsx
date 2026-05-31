import { TrendingSongsPageClient } from '@/components/section/music/TrendingSongsPageClient';
import type { TrendingSong } from '@/components/section/music/TrendingSongs';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToTrendingSong } from '@/lib/utils/publicApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';

interface TrendingSongsGridSectionProps {
  category: string;
  page: number;
}

export async function TrendingSongsGridSection({ category, page }: TrendingSongsGridSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: {
      type: MUSIC_TYPES.trending,
      category: category && category !== 'all' ? category : undefined,
    },
  }) as `?${string}`;
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', { query }, ISR_PUBLIC_FETCH.fast);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending songs unavailable"
        message={res.error?.message ?? 'Failed to load trending songs'}
      />
    );
  }

  const trendingSongs = (res.data?.music ?? []).map(
    mapPublicMusicToTrendingSong
  ) as (TrendingSong & { category?: string })[];

  return (
    <TrendingSongsPageClient
      showCategories={false}
      categoryOptions={[]}
      trendingSongs={trendingSongs}
      pagination={res.data?.pagination ?? null}
    />
  );
}
