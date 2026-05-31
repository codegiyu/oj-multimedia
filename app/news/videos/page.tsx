import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { NewsCategoriesSection } from '../_sections/NewsCategoriesSection';
import { VideoNewsSection } from '../_sections/VideoNewsSection';
import { NewsCategoriesSkeleton, VideoNewsSectionSkeleton } from '../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Video Stories - News & Lifestyle Updates',
  description:
    'Watch video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more.',
};

interface VideoNewsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function VideoNewsPage({ searchParams }: VideoNewsPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);
  const category = await normalizePublicCategoryByScope(
    'news',
    params.category,
    ISR_PUBLIC_FETCH.fast
  );
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

  return (
    <MainLayout>
      <SubPageHero
        title="Video Stories"
        titleHighlight="Video"
        description="Watch engaging video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more. Visual stories that bring content to life."
        badgeText="Watch & Learn"
        badgeIcon="Play"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Play', text: 'Video content' }, { text: 'Multiple categories' }]}
      />
      <Suspense fallback={<NewsCategoriesSkeleton />}>
        <NewsCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<VideoNewsSectionSkeleton />} key={`${category}|${page}`}>
        <VideoNewsSection
          category={category}
          page={page}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
