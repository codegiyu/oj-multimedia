import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ShortFormVideosPageClient } from '@/components/section/video/ShortFormVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import { filterByCategory } from '@/lib/utils/videos';
import type { ShortFormVideo } from '@/components/section/video/ShortFormVideos';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';

export const metadata: Metadata = {
  title: 'Short Form Videos - Quick Clips',
  description:
    'Discover short form videos - quick, engaging content perfect for quick viewing. Bite-sized entertainment and inspiration.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate short form videos data from central constants
async function generateShortFormVideosData(): Promise<{
  shortFormVideos: (ShortFormVideo & { category: string })[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const shortFormVideos: (ShortFormVideo & { category: string })[] = VIDEOS_ITEMS.filter(
    item =>
      item.isShortForm &&
      item.views !== undefined &&
      item.duration !== undefined &&
      item.likes !== undefined
  ).map(item => ({
    id: item.id,
    title: item.title,
    creator: item.creator,
    thumbnail: item.thumbnail,
    views: item.views!,
    duration: item.duration!,
    likes: item.likes!,
    category: item.category, // category is required in VideoItem, so this is always a string
  }));

  return {
    shortFormVideos,
  };
}

interface ShortFormVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShortFormVideosPage({ searchParams }: ShortFormVideosPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateShortFormVideosData();

  // Filter data server-side based on category
  const filteredData = {
    shortFormVideos: filterByCategory(data.shortFormVideos, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Short Form Videos"
        titleHighlight="Short Form"
        description="Discover short form videos - quick, engaging content perfect for quick viewing. Bite-sized entertainment and inspiration."
        badgeText="Quick Clips"
        badgeIcon="Zap"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Zap', text: 'Quick content' }, { text: 'Under 2 minutes' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <ShortFormVideosPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
