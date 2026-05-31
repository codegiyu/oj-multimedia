import { LongFormVideos } from '@/components/section/video/LongFormVideos';
import { RecentVideosPageClient } from '@/components/section/video/RecentVideosPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicVideoToRecentUpload } from '@/lib/utils/publicApiMappers';
import { buildVideoBaseQuery, type VideoSectionProps } from './shared';

type LongFormVideosSectionProps = VideoSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function LongFormVideosSection({
  category,
  limit = 12,
  fetchOptions,
  variant = 'hub',
  maxItems = 4,
  showCategoryNav = false,
}: LongFormVideosSectionProps) {
  const query = `${buildVideoBaseQuery(category, limit)}&type=${VIDEO_TYPES.longForm}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Long-form videos unavailable"
        message={res.error?.message ?? 'Failed to load long-form videos'}
      />
    );
  }

  const longFormVideos = (res.data?.videos ?? [])
    .map(mapPublicVideoToRecentUpload)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <RecentVideosPageClient recentUploads={longFormVideos} showCategoryNav={showCategoryNav} />
    );
  }

  return <LongFormVideos videos={longFormVideos} />;
}
