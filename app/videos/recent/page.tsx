import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { RecentVideosPageClient } from '@/components/section/video/RecentVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import { filterByCategory } from '@/lib/utils/videos';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';

export const metadata: Metadata = {
  title: 'Recent Uploads - Fresh Videos',
  description:
    'Discover the latest video uploads from creators. Fresh content just added to the platform.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate recent uploads data from central constants
async function generateRecentUploadsData(): Promise<{
  recentUploads: (RecentVideoUpload & { category: string })[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const recentUploads: (RecentVideoUpload & { category: string })[] = VIDEOS_ITEMS.filter(
    item =>
      item.isRecent &&
      item.uploadedAt !== undefined &&
      item.category !== undefined &&
      item.views !== undefined &&
      item.duration !== undefined
  ).map(item => ({
    _id: item._id,
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

  return {
    recentUploads,
  };
}

interface RecentUploadsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function RecentUploadsPage({ searchParams }: RecentUploadsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateRecentUploadsData();

  // Filter data server-side based on category
  const filteredData = {
    recentUploads: filterByCategory(data.recentUploads, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Recent Uploads"
        titleHighlight="Recent"
        description="Discover the latest video uploads from creators. Fresh content just added to the platform."
        badgeText="Fresh"
        badgeIcon="Sparkles"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Sparkles', text: 'Just added' }, { text: 'Updated daily' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <RecentVideosPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
