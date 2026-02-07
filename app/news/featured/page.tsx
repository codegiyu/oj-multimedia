import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { FeaturedStoriesPageClient } from '@/components/section/news/FeaturedStoriesPageClient';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import type { FeaturedStory } from '@/components/section/news/FeaturedStories';
import { NEWS_ITEMS } from '@/lib/constants/news';

export const metadata: Metadata = {
  title: 'Featured Stories - News & Lifestyle Updates',
  description:
    'Explore our featured stories - handpicked articles covering lifestyle, inspiration, culture, and trending topics.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate featured stories data from central constants
async function generateFeaturedStoriesData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const featuredStories: FeaturedStory[] = NEWS_ITEMS.filter(
    item => item.isFeatured && item.excerpt !== undefined && item.comments !== undefined
  ).map(item => ({
    _id: item._id,
    title: item.title,
    excerpt: item.excerpt!,
    category: item.category,
    image: item.image,
    readTime: item.readTime,
    views: item.views,
    comments: item.comments!,
    featured: item.isFeatured,
    videoUrl: item.videoUrl,
    author: item.author,
    date: item.date,
  }));

  return {
    featuredStories,
  };
}

interface FeaturedStoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FeaturedStoriesPage({ searchParams }: FeaturedStoriesPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateFeaturedStoriesData();

  // Filter data server-side based on category
  const filteredData = {
    featuredStories: filterByCategory(data.featuredStories, category),
  };

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
        <FeaturedStoriesPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
