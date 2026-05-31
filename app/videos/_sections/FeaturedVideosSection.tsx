import { FeaturedVideos } from '@/components/section/video/FeaturedVideos';
import { FeaturedVideosPageClient } from '@/components/section/video/FeaturedVideosPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicVideoToFeaturedVideo } from '@/lib/utils/publicApiMappers';
import { buildVideoBaseQuery, type VideoSectionProps } from './shared';

type FeaturedVideosSectionProps = VideoSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function FeaturedVideosSection({
  category,
  limit = 12,
  fetchOptions,
  variant = 'hub',
  maxItems = 4,
  showCategoryNav = false,
}: FeaturedVideosSectionProps) {
  const query = `${buildVideoBaseQuery(category, limit)}&type=${VIDEO_TYPES.featured}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Featured videos unavailable"
        message={res.error?.message ?? 'Failed to load featured videos'}
      />
    );
  }

  const featuredVideos = (res.data?.videos ?? [])
    .map(mapPublicVideoToFeaturedVideo)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <FeaturedVideosPageClient featuredVideos={featuredVideos} showCategoryNav={showCategoryNav} />
    );
  }

  return <FeaturedVideos videos={featuredVideos} />;
}
