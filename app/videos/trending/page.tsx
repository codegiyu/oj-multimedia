import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { TrendingVideosPageClient } from '@/components/section/video/TrendingVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import { filterByCategory } from '@/lib/utils/videos';
import type { TrendingVideo } from '@/components/section/video/TrendingVideos';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';

export const metadata: Metadata = {
  title: 'Trending Videos - Latest Content',
  description:
    "Discover what's trending now - the most popular videos everyone is watching. Stay ahead of the video content scene.",
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate trending videos data from central constants
async function generateTrendingVideosData(): Promise<{
  trendingVideos: (TrendingVideo & { category: string })[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const trendingVideos: (TrendingVideo & { category: string })[] = VIDEOS_ITEMS.filter(
    item =>
      item.isTrending &&
      item.views !== undefined &&
      item.duration !== undefined &&
      item.uploadedAt !== undefined
  ).map(item => ({
    _id: item._id,
    title: item.title,
    creator: item.creator,
    thumbnail: item.thumbnail,
    views: item.views!,
    duration: item.duration!,
    uploadedAt: item.uploadedAt!,
    isNew: item.isNew || false,
    category: item.category, // category is required in VideoItem, so this is always a string
  }));

  return {
    trendingVideos,
  };
}

interface TrendingVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function TrendingVideosPage({ searchParams }: TrendingVideosPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateTrendingVideosData();

  // Filter data server-side based on category
  const filteredData = {
    trendingVideos: filterByCategory(data.trendingVideos, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Trending Videos"
        titleHighlight="Trending"
        description="Discover what's hot right now - the most popular videos everyone is watching. Stay ahead of the video content scene."
        badgeText="What's Hot"
        badgeIcon="Flame"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Flame', text: 'Most popular' }, { text: 'Updated in real-time' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <TrendingVideosPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
