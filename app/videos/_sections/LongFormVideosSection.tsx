import { LongFormVideos } from '@/components/section/video/LongFormVideos';
import { LongFormVideosPageClient } from '@/components/section/video/LongFormVideosPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicVideoToRecentUpload } from '@/lib/utils/publicApiMappers';
import { buildVideoBrowseQuery, type VideoSectionProps } from './shared';

type LongFormVideosSectionProps = VideoSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function LongFormVideosSection({
  category,
  limit = 12,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 4,
  showCategoryNav = false,
}: LongFormVideosSectionProps) {
  const query =
    variant === 'hub'
      ? buildVideoBrowseQuery(category, 1, { limit, type: VIDEO_TYPES.longForm })
      : buildVideoBrowseQuery(category, page, { type: VIDEO_TYPES.longForm });
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
      <LongFormVideosPageClient
        longFormVideos={longFormVideos}
        showCategoryNav={showCategoryNav}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  return <LongFormVideos videos={longFormVideos} />;
}
