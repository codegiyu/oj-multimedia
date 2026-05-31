import { ShortFormVideos } from '@/components/section/video/ShortFormVideos';
import { ShortFormVideosPageClient } from '@/components/section/video/ShortFormVideosPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicVideoToShortForm } from '@/lib/utils/publicApiMappers';
import { buildVideoBrowseQuery, type VideoSectionProps } from './shared';

type ShortFormVideosSectionProps = VideoSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function ShortFormVideosSection({
  category,
  limit = 12,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 8,
  showCategoryNav = false,
}: ShortFormVideosSectionProps) {
  const query =
    variant === 'hub'
      ? buildVideoBrowseQuery(category, 1, { limit, type: VIDEO_TYPES.shortForm })
      : buildVideoBrowseQuery(category, page, { type: VIDEO_TYPES.shortForm });
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Short-form videos unavailable"
        message={res.error?.message ?? 'Failed to load short form videos'}
      />
    );
  }

  const shortFormVideos = (res.data?.videos ?? [])
    .map(mapPublicVideoToShortForm)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <ShortFormVideosPageClient
        shortFormVideos={shortFormVideos}
        showCategoryNav={showCategoryNav}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  return <ShortFormVideos videos={shortFormVideos} />;
}
