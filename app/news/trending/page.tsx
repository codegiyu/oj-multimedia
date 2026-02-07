import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingStoriesPageClient } from '@/components/section/news';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import { NEWS_ITEMS } from '@/lib/constants/news';

export const metadata: Metadata = {
  title: 'Trending Stories - News & Lifestyle Updates',
  description:
    "Discover what's trending now - the most popular stories, topics, and discussions everyone is talking about.",
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate trending stories data from central constants
async function generateTrendingStoriesData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const trendingStories: TrendingStory[] = NEWS_ITEMS.filter(item => item.isTrending)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .map(item => ({
      _id: item._id,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      readTime: item.readTime,
      rank: item.rank || 0,
      image: item.image,
      views: item.views,
      videoUrl: item.videoUrl,
      author: item.author,
      date: item.date,
    }));

  return {
    trendingStories,
  };
}

interface TrendingStoriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingStoriesPage({ searchParams }: TrendingStoriesPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateTrendingStoriesData();

  // Filter data server-side based on category
  const filteredData = {
    trendingStories: filterByCategory(data.trendingStories, category),
  };

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
      <Suspense fallback={<NewsPageSkeleton />}>
        <TrendingStoriesPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
