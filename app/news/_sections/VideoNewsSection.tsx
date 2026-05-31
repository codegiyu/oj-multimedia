import { VideoNews } from '@/components/section/news/VideoNews';
import { VideoNewsPageClient } from '@/components/section/news/VideoNewsPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToVideoNewsItem } from '@/lib/utils/publicApiMappers';
import { buildNewsBrowseQuery } from '@/lib/utils/newsBrowse';
import type { NewsSectionProps } from './shared';

type VideoNewsSectionProps = NewsSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function VideoNewsSection({
  category,
  limit = 15,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 4,
  showCategoryNav = false,
}: VideoNewsSectionProps) {
  const query =
    variant === 'hub'
      ? buildNewsBrowseQuery(category, 1, { limit, type: NEWS_TYPES.video })
      : buildNewsBrowseQuery(category, page, { type: NEWS_TYPES.video });
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, fetchOptions);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Video stories unavailable"
        message={res.error?.message ?? 'Failed to load video stories'}
      />
    );
  }

  const videoNews = (res.data?.articles ?? [])
    .map(mapPublicNewsToVideoNewsItem)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <VideoNewsPageClient
        videoNews={videoNews}
        showCategoryNav={showCategoryNav}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  return <VideoNews videos={videoNews} />;
}
