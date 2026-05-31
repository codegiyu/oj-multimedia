import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { VideoCategoriesSection } from '../../_sections/VideoCategoriesSection';
import { FeaturedVideosSection } from '../../_sections/FeaturedVideosSection';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Featured Videos - Editor Picks',
  description:
    'Discover featured videos - editor picks and popular uploads. Hand-selected content that stands out.',
};

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
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

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
      <Suspense fallback={<VideoCategoriesSkeleton />}>
        <VideoCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<VideoSubpageGridSkeleton />}>
        <FeaturedVideosSection
          category={category}
          limit={50}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
