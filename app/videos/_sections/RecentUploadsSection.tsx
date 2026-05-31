import { RecentVideoUploads } from '@/components/section/video/RecentVideoUploads';
import { RecentVideosPageClient } from '@/components/section/video/RecentVideosPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicVideoToRecentUpload } from '@/lib/utils/publicApiMappers';
import { buildVideoBrowseQuery, type VideoSectionProps } from './shared';

type RecentUploadsSectionProps = VideoSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function RecentUploadsSection({
  category,
  limit = 12,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 6,
  showCategoryNav = false,
}: RecentUploadsSectionProps) {
  const query =
    variant === 'hub'
      ? buildVideoBrowseQuery(category, 1, { limit, type: VIDEO_TYPES.recent })
      : buildVideoBrowseQuery(category, page, { type: VIDEO_TYPES.recent });
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Recent uploads unavailable"
        message={res.error?.message ?? 'Failed to load recent videos'}
      />
    );
  }

  const recentUploads = (res.data?.videos ?? [])
    .map(mapPublicVideoToRecentUpload)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <RecentVideosPageClient
        recentUploads={recentUploads}
        showCategoryNav={showCategoryNav}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  return <RecentVideoUploads uploads={recentUploads} />;
}
