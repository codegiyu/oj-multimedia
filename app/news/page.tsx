import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsHero } from '@/components/section/news/NewsHero';
import { NewsPageClient } from '@/components/section/news/NewsPageClient';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import type { FeaturedStory } from '@/components/section/news/FeaturedStories';
import type { NewsItem as NewsFeedItem } from '@/components/section/news/NewsFeed';
import type { TrendingStory } from '@/components/section/news/TrendingSidebar';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';
import { NEWS_ITEMS } from '@/lib/constants/news';

export const metadata: Metadata = {
  title: 'News & Lifestyle Updates',
  description:
    'Stay updated with the latest news, announcements, inspirational stories, lifestyle content, and trending topics. Explore recent updates and popular stories.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate news data from central constants
async function generateNewsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter and transform featured stories (limit to 3)
  const featuredStories: FeaturedStory[] = NEWS_ITEMS.filter(
    item => item.isFeatured && item.excerpt !== undefined && item.comments !== undefined
  )
    .slice(0, 3)
    .map(item => ({
      id: item.id,
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

  // Filter and transform latest/news feed items (limit to 10)
  const newsItems: NewsFeedItem[] = NEWS_ITEMS.filter(
    item => item.isLatest && item.excerpt !== undefined && item.comments !== undefined
  )
    .slice(0, 10)
    .map(item => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt!,
      category: item.category,
      image: item.image,
      readTime: item.readTime,
      views: item.views,
      comments: item.comments!,
      likes: item.likes || 0,
      videoUrl: item.videoUrl,
      author: item.author,
      date: item.date,
    }));

  // Filter and transform trending stories (limit to 6)
  const trendingStories: TrendingStory[] = NEWS_ITEMS.filter(item => item.isTrending)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .slice(0, 6)
    .map(item => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      readTime: item.readTime,
      rank: item.rank || 0,
      image: item.image,
      views: item.views,
      videoUrl: item.videoUrl,
    }));

  // Filter and transform video news (items with videoUrl and duration, limit to 4)
  const videoNews: VideoNewsItem[] = NEWS_ITEMS.filter(item => item.videoUrl && item.duration)
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      duration: item.duration!,
      image: item.image,
      views: item.views,
      author: item.author,
      date: item.date,
    }));

  return {
    featuredStories,
    newsItems,
    trendingStories,
    videoNews,
  };
}

interface NewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const newsData = await generateNewsData();

  // Filter data server-side based on category
  const filteredData = {
    featuredStories: filterByCategory(newsData.featuredStories, category),
    newsItems: filterByCategory(newsData.newsItems, category),
    trendingStories: filterByCategory(newsData.trendingStories, category),
    videoNews: filterByCategory(newsData.videoNews, category),
  };

  return (
    <MainLayout>
      <NewsHero />
      <Suspense fallback={<NewsPageSkeleton />}>
        <NewsPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
