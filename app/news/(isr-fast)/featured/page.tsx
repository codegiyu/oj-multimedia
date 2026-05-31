import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { NewsCategoriesSection } from '../../_sections/NewsCategoriesSection';
import { FeaturedStoriesSection } from '../../_sections/FeaturedStoriesSection';
import { NewsCategoriesSkeleton, NewsSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Featured Stories - News & Lifestyle Updates',
  description:
    'Explore our featured stories - handpicked articles covering lifestyle, inspiration, culture, and trending topics.',
};

interface FeaturedStoriesPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function FeaturedStoriesPage({ searchParams }: FeaturedStoriesPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);
  const category = await normalizePublicCategoryByScope(
    'news',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

  return (
    <MainLayout>
      <SubPageHero
        title="Featured Stories"
        titleHighlight="Featured"
        description="Explore our handpicked collection of featured stories covering lifestyle, inspiration, culture, and trending topics. Curated content worth your time."
        badgeText="Curated Collection"
        badgeIcon="Sparkles"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Sparkles', text: 'Handpicked stories' }, { text: 'Updated regularly' }]}
      />
      <Suspense fallback={<NewsCategoriesSkeleton />}>
        <NewsCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<NewsSubpageGridSkeleton />} key={`${category}|${page}`}>
        <FeaturedStoriesSection
          category={category}
          page={page}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
