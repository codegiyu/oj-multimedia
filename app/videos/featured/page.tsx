import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { FeaturedVideosPageClient } from '@/components/section/video/FeaturedVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import { filterByCategory } from '@/lib/utils/videos';
import type { FeaturedVideo } from '@/components/section/video/FeaturedVideos';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';

export const metadata: Metadata = {
  title: 'Featured Videos - Editor Picks',
  description:
    'Discover featured videos - editor picks and popular uploads. Hand-selected content that stands out.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate featured videos data from central constants
async function generateFeaturedVideosData(): Promise<{
  featuredVideos: (FeaturedVideo & { category: string })[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const featuredVideos: (FeaturedVideo & { category: string })[] = VIDEOS_ITEMS.filter(
    item =>
      item.isFeatured &&
      item.views !== undefined &&
      item.duration !== undefined &&
      item.category !== undefined
  ).map(item => ({
    _id: item._id,
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

  return {
    featuredVideos,
  };
}

interface FeaturedVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FeaturedVideosPage({ searchParams }: FeaturedVideosPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateFeaturedVideosData();

  // Filter data server-side based on category
  const filteredData = {
    featuredVideos: filterByCategory(data.featuredVideos, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Featured Videos"
        titleHighlight="Featured"
        description="Discover featured videos - editor picks and popular uploads. Hand-selected content that stands out."
        badgeText="Editor's Choice"
        badgeIcon="Star"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Star', text: 'Editor picks' }, { text: 'Top quality content' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <FeaturedVideosPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
