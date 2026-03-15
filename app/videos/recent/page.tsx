import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { RecentVideosPageClient } from '@/components/section/video/RecentVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IPublicVideosListRes } from '@/lib/constants/endpoints';
import { filterByCategory } from '@/lib/utils/videos';
import { mapPublicVideoToRecentUpload } from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Recent Uploads - Fresh Videos',
  description:
    'Discover the latest video uploads from creators. Fresh content just added to the platform.',
};

export const dynamic = 'force-dynamic';

async function fetchRecentVideos(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query = `?limit=50&page=1&status=published&type=recent${categoryParam}` as const;
  const res = await callServerApi('PUBLIC_GET_VIDEOS', { query });
  if (res.error) {
    return {
      recentUploads: [] as RecentVideoUpload[],
      initialErrorMessage:
        (res.error as ApiErrorResponse)?.message ?? 'Failed to load recent videos',
    };
  }
  const data = res.data as IPublicVideosListRes | undefined;
  const raw = data?.videos ?? [];
  const recentUploads = filterByCategory(raw, category).map(mapPublicVideoToRecentUpload);
  return { recentUploads, initialErrorMessage: null as string | null };
}

interface RecentVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function RecentVideosPage({ searchParams }: RecentVideosPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

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
  const data = await fetchRecentVideos(category);
  return <RecentVideosPageClient {...data} />;
}
