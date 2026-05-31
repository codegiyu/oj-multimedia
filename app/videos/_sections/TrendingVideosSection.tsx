import { TrendingVideos } from '@/components/section/video/TrendingVideos';
import { TrendingVideosPageClient } from '@/components/section/video/TrendingVideosPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicVideoToTrendingVideo } from '@/lib/utils/publicApiMappers';
import { buildVideoBaseQuery, type VideoSectionProps } from './shared';

type TrendingVideosSectionProps = VideoSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function TrendingVideosSection({
  category,
  limit = 12,
  fetchOptions,
  variant = 'hub',
  maxItems = 8,
  showCategoryNav = false,
}: TrendingVideosSectionProps) {
  const query = `${buildVideoBaseQuery(category, limit)}&type=${VIDEO_TYPES.trending}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending videos unavailable"
        message={res.error?.message ?? 'Failed to load trending videos'}
      />
    );
  }

  const trendingVideos = (res.data?.videos ?? [])
    .map(mapPublicVideoToTrendingVideo)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <TrendingVideosPageClient trendingVideos={trendingVideos} showCategoryNav={showCategoryNav} />
    );
  }

  return <TrendingVideos videos={trendingVideos} />;
}
