import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { CreatorsPageClient } from '@/components/section/video/CreatorsPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import { filterByCategory } from '@/lib/utils/videos';
import type { FeaturedCreator } from '@/components/section/video/CreatorSpotlight';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';

export const metadata: Metadata = {
  title: 'Featured Creators - Video Creators',
  description:
    'Discover featured creators and video makers. Explore profiles, follow your favorites, and discover new content from talented creators.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate featured creators data from central constants
async function generateFeaturedCreatorsData(): Promise<{
  featuredCreators: (FeaturedCreator & { category: string })[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const featuredCreators: (FeaturedCreator & { category: string })[] = VIDEOS_ITEMS.filter(
    item =>
      item.isFeaturedCreator &&
      item.name !== undefined &&
      item.followers !== undefined &&
      item.videos !== undefined &&
      item.views !== undefined &&
      item.latestVideo !== undefined
  ).map(item => ({
    _id: item._id,
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
    featuredCreators,
  };
}

interface FeaturedCreatorsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FeaturedCreatorsPage({ searchParams }: FeaturedCreatorsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateFeaturedCreatorsData();

  // Filter data server-side based on category
  const filteredData = {
    featuredCreators: filterByCategory(data.featuredCreators, category) as (FeaturedCreator & {
      category: string;
    })[],
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Featured Creators"
        titleHighlight="Featured"
        description="Discover featured creators and video makers. Explore profiles, follow your favorites, and discover new content from talented creators."
        badgeText="Creators"
        badgeIcon="Users"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Users', text: 'Top creators' }, { text: 'Multiple categories' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <CreatorsPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
