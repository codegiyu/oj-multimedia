import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { FeaturedVideosPageClient } from '@/components/section/video/FeaturedVideosPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { FeaturedVideo } from '@/components/section/video/FeaturedVideos';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapPublicVideoToFeaturedVideo } from '@/lib/utils/publicApiMappers';
import { VIDEO_TYPES } from '@/lib/constants/contentTaxonomy';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { videoCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';

export const metadata: Metadata = {
  title: 'Featured Videos - Editor Picks',
  description:
    'Discover featured videos - editor picks and popular uploads. Hand-selected content that stands out.',
};

async function fetchFeaturedVideos(category: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const query =
    `?limit=50&page=1&status=published&type=${VIDEO_TYPES.featured}${categoryParam}` as const;
  const res = await callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, ISR_PUBLIC_FETCH.fast);
  if (res.type === 'error') {
    return {
      featuredVideos: [] as FeaturedVideo[],
      initialErrorMessage: res.error?.message ?? 'Failed to load featured videos',
    };
  }

  const raw = res.data?.videos ?? [];
  const featuredVideos = raw.map(mapPublicVideoToFeaturedVideo);
  return { featuredVideos, initialErrorMessage: null as string | null };
}

interface FeaturedVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FeaturedVideosPage({ searchParams }: FeaturedVideosPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope(
    'video',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );

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
        <FeaturedVideosServer category={category} />
      </Suspense>
    </MainLayout>
  );
}

async function FeaturedVideosServer({ category }: { category: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchFeaturedVideos(category),
    fetchPublicCategoryNav('video', 'All Videos', videoCategoryNavFallback, ISR_PUBLIC_FETCH.fast),
  ]);

  return <FeaturedVideosPageClient {...data} categoryOptions={categoryOptions} />;
}
