import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { NewsCategoriesSection } from '../../_sections/NewsCategoriesSection';
import { TrendingSidebarSection } from '../../_sections/TrendingSidebarSection';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Trending Stories - News & Lifestyle Updates',
  description:
    "Discover what's trending now - the most popular stories, topics, and discussions everyone is talking about.",
};

interface TrendingStoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingStoriesPage({ searchParams }: TrendingStoriesPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope(
    'news',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

  return (
    <MainLayout>
      <SubPageHero
        title="Trending Stories"
        titleHighlight="Trending"
        description="Discover what's hot right now - the most popular stories, topics, and discussions everyone is talking about. Stay ahead of the conversation."
        badgeText="What's Hot"
        badgeIcon="TrendingUp"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }]}
      />
      <Suspense fallback={<NewsCategoriesSkeleton />}>
        <NewsCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<NewsSubpageGridSkeleton />}>
        <TrendingSidebarSection
          category={category}
          limit={50}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
