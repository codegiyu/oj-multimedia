import { BreakingNews } from '@/components/section/news/BreakingNews';
import { BreakingNewsPageClient } from '@/components/section/news/BreakingNewsPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { NEWS_TYPES } from '@/lib/constants/contentTaxonomy';
import { mapPublicNewsToBreakingStory } from '@/lib/utils/publicApiMappers';
import { fetchPublicNewsArticles, type NewsSectionProps } from './shared';

type BreakingNewsSectionProps = NewsSectionProps & {
  variant?: 'hub' | 'subpage';
  maxItems?: number;
  showCategoryNav?: boolean;
};

export async function BreakingNewsSection({
  category,
  limit = 15,
  page = 1,
  fetchOptions,
  variant = 'hub',
  maxItems = 8,
  showCategoryNav = false,
}: BreakingNewsSectionProps) {
  const { articles, pagination, error } = await fetchPublicNewsArticles({
    category,
    page: variant === 'hub' ? 1 : page,
    limit: variant === 'hub' ? limit : undefined,
    type: NEWS_TYPES.breaking,
    fetchOptions,
  });

  if (error && articles.length === 0) {
    return <SectionLoadError title="Breaking news unavailable" message={error} />;
  }

  const breakingStories = articles
    .map(mapPublicNewsToBreakingStory)
    .slice(0, variant === 'hub' ? maxItems : undefined);

  if (variant === 'subpage') {
    return (
      <BreakingNewsPageClient
        breakingStories={breakingStories}
        showCategoryNav={showCategoryNav}
        pagination={pagination}
      />
    );
  }

  return <BreakingNews stories={breakingStories} />;
}
