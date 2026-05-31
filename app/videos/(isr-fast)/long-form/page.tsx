import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { RecentVideosPageClient } from '@/components/section/video/RecentVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapPublicVideoToRecentUpload } from '@/lib/utils/publicApiMappers';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { videoCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';

export const metadata: Metadata = {
  title: 'Long-form Videos - Films & Extended Content',
  description:
    'Watch long-form videos, films, and extended content from creators on OJ Multimedia.',
};

async function fetchLongFormVideos(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${VIDEO_TYPES.longForm}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, ISR_PUBLIC_FETCH.fast);
  if (res.type === 'error') {
    return {
      recentUploads: [] as RecentVideoUpload[],
      initialErrorMessage: res.error?.message ?? 'Failed to load long-form videos',
    };
  }

  const raw = res.data?.videos ?? [];
  const recentUploads = raw.map(mapPublicVideoToRecentUpload);
  return { recentUploads, initialErrorMessage: null as string | null };
}

interface LongFormVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function LongFormVideosPage({ searchParams }: LongFormVideosPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope(
    'video',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );

  return (
    <MainLayout>
      <SubPageHero
        title="Long-form Videos"
        titleHighlight="Long-form"
        description="Films, documentaries, and extended video content from our creators."
        badgeText="Extended"
        badgeIcon="Play"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Play', text: 'Films & long video' }, { text: 'Curated collection' }]}
      />
      <Suspense fallback={<VideoPageSkeleton />}>
        <LongFormVideosServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function LongFormVideosServer({ category }: { category: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchLongFormVideos(category),
    fetchPublicCategoryNav('video', 'All Videos', videoCategoryNavFallback, ISR_PUBLIC_FETCH.fast),
  ]);

  return <RecentVideosPageClient {...data} categoryOptions={categoryOptions} />;
}
