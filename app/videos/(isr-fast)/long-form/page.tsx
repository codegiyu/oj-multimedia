import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { VideoCategoriesSection } from '../../_sections/VideoCategoriesSection';
import { LongFormVideosSection } from '../../_sections/LongFormVideosSection';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Long-form Videos - Films & Extended Content',
  description:
    'Watch long-form videos, films, and extended content from creators on OJ Multimedia.',
};

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
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

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
      <Suspense fallback={<VideoCategoriesSkeleton />}>
        <VideoCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<VideoSubpageGridSkeleton />}>
        <LongFormVideosSection
          category={category}
          limit={50}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
