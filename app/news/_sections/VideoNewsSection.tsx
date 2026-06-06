import { VideoNews } from '@/components/section/news/VideoNews';
import { VideoNewsPageClient } from '@/components/section/news/VideoNewsPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToVideoNewsItem } from '@/lib/utils/publicApiMappers';
import { fetchPublicNewsArticles, type NewsSectionProps } from './shared';

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
  const { articles, pagination, error } = await fetchPublicNewsArticles({
    category,
    page: variant === 'hub' ? 1 : page,
    limit: variant === 'hub' ? limit : undefined,
    type: NEWS_TYPES.video,
    fetchOptions,
  });

  if (error && articles.length === 0) {
    return <SectionLoadError title="Video stories unavailable" message={error} />;
  }

  const videoNews = articles
    .map(mapPublicNewsToVideoNewsItem)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <VideoNewsPageClient
        videoNews={videoNews}
        showCategoryNav={showCategoryNav}
        pagination={pagination}
      />
    );
  }

  return <VideoNews videos={videoNews} />;
}
