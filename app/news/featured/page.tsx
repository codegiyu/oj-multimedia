import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { FeaturedStoriesPageClient } from '@/components/section/news/FeaturedStoriesPageClient';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import type { FeaturedStory } from '@/components/section/news/FeaturedStories';
import { callServerApi } from '@/lib/services/serverApi';
import { mapPublicNewsToFeaturedStory } from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Featured Stories - News & Lifestyle Updates',
  description:
    'Explore our featured stories - handpicked articles covering lifestyle, inspiration, culture, and trending topics.',
};

export const dynamic = 'force-dynamic';

async function fetchFeaturedStories(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query = `?limit=50&page=1&status=published&type=featured${categoryParam}` as const;
  const res = await callServerApi('PUBLIC_GET_NEWS', { query });

  if (res.type === 'error') {
    return {
      featuredStories: [] as FeaturedStory[],
      initialErrorMessage: res.error?.message ?? 'Failed to load featured stories',
    };
  }

  const raw = res.data?.articles ?? [];
  const featuredStories = filterByCategory(raw.map(mapPublicNewsToFeaturedStory), category);
  return { featuredStories, initialErrorMessage: null as string | null };
}

interface FeaturedStoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FeaturedStoriesPage({ searchParams }: FeaturedStoriesPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

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
      <Suspense fallback={<NewsPageSkeleton />}>
        <FeaturedStoriesServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function FeaturedStoriesServer({ category }: { category: string }) {
  const data = await fetchFeaturedStories(category);
  return <FeaturedStoriesPageClient {...data} />;
}
