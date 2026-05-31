import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { VideoCategoriesSection } from '../../_sections/VideoCategoriesSection';
import { TrendingVideosSection } from '../../_sections/TrendingVideosSection';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Trending Videos - Latest Content',
  description:
    "Discover what's trending now - the most popular videos everyone is watching. Stay ahead of the video content scene.",
};

interface TrendingVideosPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function TrendingVideosPage({ searchParams }: TrendingVideosPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);
  const category = await normalizePublicCategoryByScope(
    'video',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

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
      <Suspense fallback={<VideoCategoriesSkeleton />}>
        <VideoCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<VideoSubpageGridSkeleton />} key={`${category}|${page}`}>
        <TrendingVideosSection
          category={category}
          page={page}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
