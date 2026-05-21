import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { RecentVideosPageClient } from '@/components/section/video/RecentVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterByCategory } from '@/lib/utils/videos';
import { mapPublicVideoToRecentUpload } from '@/lib/utils/publicApiMappers';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { videoCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';

export const metadata: Metadata = {
  title: 'Recent Uploads - Fresh Videos',
  description:
    'Discover the latest video uploads from creators. Fresh content just added to the platform.',
};

async function fetchRecentVideos(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${VIDEO_TYPES.recent}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query });
  if (res.type === 'error') {
    return {
      recentUploads: [] as RecentVideoUpload[],
      initialErrorMessage: res.error?.message ?? 'Failed to load recent videos',
    };
  }

  const raw = res.data?.videos ?? [];
  const recentUploads = filterByCategory(raw, category).map(mapPublicVideoToRecentUpload);
  return { recentUploads, initialErrorMessage: null as string | null };
}

interface RecentVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function RecentVideosPage({ searchParams }: RecentVideosPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('video', params.category);

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
        <RecentVideosServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function RecentVideosServer({ category }: { category: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchRecentVideos(category),
    fetchPublicCategoryNav('video', 'All Videos', videoCategoryNavFallback),
  ]);

  return <RecentVideosPageClient {...data} categoryOptions={categoryOptions} />;
}
