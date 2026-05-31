import { TrendingSongsPageClient } from '@/components/section/music/TrendingSongsPageClient';
import type { TrendingSong } from '@/components/section/music/TrendingSongs';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToTrendingSong } from '@/lib/utils/publicApiMappers';
interface TrendingSongsGridSectionProps {
  category: string;
}

export async function TrendingSongsGridSection({ category }: TrendingSongsGridSectionProps) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${MUSIC_TYPES.trending}${categoryParam}` as const;
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
    />
  );
}
