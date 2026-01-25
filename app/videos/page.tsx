import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoHero } from '@/components/section/video/VideoHero';
import { VideoPageClient } from '@/components/section/video/VideoPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { TrendingVideo } from '@/components/section/video/TrendingVideos';
import type { FeaturedVideo } from '@/components/section/video/FeaturedVideos';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import type { ShortFormVideo } from '@/components/section/video/ShortFormVideos';
import type { FeaturedCreator } from '@/components/section/video/CreatorSpotlight';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';
import { filterByCategory } from '@/lib/utils/videos';

export const metadata: Metadata = {
  title: 'Videos - Trending & Creative Content',
  description:
    'Discover trending videos, watch creative content, explore music videos, short clips, talks, and inspirational videos from talented creators. Upload and share your own videos.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate video data from central constants
async function generateVideoData(category: string = 'all') {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter VIDEOS_ITEMS by category first
  const filteredItems = filterByCategory(VIDEOS_ITEMS, category);

  // Filter and transform trending videos (limit to 8)
  const trendingVideos: TrendingVideo[] = filteredItems
    .filter(
      item =>
        item.isTrending &&
        item.views !== undefined &&
        item.duration !== undefined &&
        item.uploadedAt !== undefined
    )
    .slice(0, 8)
    .map(item => ({
      id: item.id,
      title: item.title,
      creator: item.creator,
      thumbnail: item.thumbnail,
      views: item.views!,
      duration: item.duration!,
      uploadedAt: item.uploadedAt!,
      isNew: item.isNew || false,
    }));

  // Filter and transform featured videos (limit to 4)
  const featuredVideos: FeaturedVideo[] = filteredItems
    .filter(
      item =>
        item.isFeatured &&
        item.views !== undefined &&
        item.duration !== undefined &&
        item.category !== undefined
    )
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: item.title,
      creator: item.creator,
      thumbnail: item.thumbnail,
      views: item.views!,
      duration: item.duration!,
      category:
        item.category === 'music'
          ? 'Music Videos'
          : item.category === 'short'
            ? 'Short Clips'
            : item.category === 'talks'
              ? 'Talks & Speeches'
              : item.category === 'creative'
                ? 'Creative Content'
                : item.category === 'inspirational'
                  ? 'Inspirational'
                  : item.category === 'live'
                    ? 'Live Performances'
                    : 'Podcasts / Video Talks',
      featured: item.featured || false,
    }));

  // Filter and transform recent uploads (limit to 6)
  const recentUploads: RecentVideoUpload[] = filteredItems
    .filter(
      item =>
        item.isRecent &&
        item.uploadedAt !== undefined &&
        item.category !== undefined &&
        item.views !== undefined &&
        item.duration !== undefined
    )
    .slice(0, 6)
    .map(item => ({
      id: item.id,
      title: item.title,
      creator: item.creator,
      thumbnail: item.thumbnail,
      uploadedAt: item.uploadedAt!,
      category:
        item.category === 'music'
          ? 'Music Videos'
          : item.category === 'short'
            ? 'Short Clips'
            : item.category === 'talks'
              ? 'Talks & Speeches'
              : item.category === 'creative'
                ? 'Creative Content'
                : item.category === 'inspirational'
                  ? 'Inspirational'
                  : item.category === 'live'
                    ? 'Live Performances'
                    : 'Podcasts / Video Talks',
      views: item.views!,
      duration: item.duration!,
    }));

  // Filter and transform short form videos (limit to 8)
  const shortFormVideos: ShortFormVideo[] = filteredItems
    .filter(
      item =>
        item.isShortForm &&
        item.views !== undefined &&
        item.duration !== undefined &&
        item.likes !== undefined
    )
    .slice(0, 8)
    .map(item => ({
      id: item.id,
      title: item.title,
      creator: item.creator,
      thumbnail: item.thumbnail,
      views: item.views!,
      duration: item.duration!,
      likes: item.likes!,
    }));

  // Filter and transform featured creators (limit to 6)
  const featuredCreators: FeaturedCreator[] = filteredItems
    .filter(
      item =>
        item.isFeaturedCreator &&
        item.name !== undefined &&
        item.followers !== undefined &&
        item.videos !== undefined &&
        item.views !== undefined &&
        item.latestVideo !== undefined
    )
    .slice(0, 6)
    .map(item => ({
      id: item.id,
      name: item.name || item.creator,
      category:
        item.category === 'music'
          ? 'Music Videos'
          : item.category === 'short'
            ? 'Short Clips'
            : item.category === 'talks'
              ? 'Talks & Speeches'
              : item.category === 'creative'
                ? 'Creative Content'
                : item.category === 'inspirational'
                  ? 'Inspirational'
                  : item.category === 'live'
                    ? 'Live Performances'
                    : 'Podcasts / Video Talks',
      avatar: item.avatar || item.thumbnail,
      followers: item.followers!,
      videos: item.videos!,
      views: item.views!,
      verified: item.verified || false,
      latestVideo: item.latestVideo!,
    }));

  return {
    trendingVideos,
    featuredVideos,
    recentUploads,
    shortFormVideos,
    featuredCreators,
  };
}

interface VideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const videoData = await generateVideoData(category);

  return (
    <MainLayout>
      <VideoHero />
      <Suspense fallback={<VideoPageSkeleton />}>
        <VideoPageClient {...videoData} />
      </Suspense>
    </MainLayout>
  );
}
