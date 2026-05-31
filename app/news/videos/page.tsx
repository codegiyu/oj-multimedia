import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { NewsCategoriesSection } from '../_sections/NewsCategoriesSection';
import { VideoNewsSection } from '../_sections/VideoNewsSection';
import { NewsCategoriesSkeleton, VideoNewsSectionSkeleton } from '../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Video Stories - News & Lifestyle Updates',
  description:
    'Watch video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more.',
};

interface VideoNewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideoNewsPage({ searchParams }: VideoNewsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('news', params.category);

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
        <NewsCategoriesSection category={category} />
      </Suspense>
      <Suspense fallback={<VideoNewsSectionSkeleton />}>
        <VideoNewsSection category={category} limit={50} variant="subpage" />
      </Suspense>
    </MainLayout>
  );
}
