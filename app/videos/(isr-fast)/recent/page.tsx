import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { VideoCategoriesSection } from '../../_sections/VideoCategoriesSection';
import { RecentUploadsSection } from '../../_sections/RecentUploadsSection';
import { VideoCategoriesSkeleton, VideoSubpageGridSkeleton } from '../../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Recent Uploads - Fresh Videos',
  description:
    'Discover the latest video uploads from creators. Fresh content just added to the platform.',
};

interface RecentVideosPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function RecentVideosPage({ searchParams }: RecentVideosPageProps) {
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
        title="Recent Uploads"
        titleHighlight="Recent"
        description="Discover the latest video uploads from creators. Fresh content just added to the platform."
        badgeText="Fresh"
        badgeIcon="Sparkles"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Sparkles', text: 'Just added' }, { text: 'Updated daily' }]}
      />
      <Suspense fallback={<VideoCategoriesSkeleton />}>
        <VideoCategoriesSection category={category} fetchOptions={fetchOptions} />
      </Suspense>
      <Suspense fallback={<VideoSubpageGridSkeleton />} key={`${category}|${page}`}>
        <RecentUploadsSection
          category={category}
          page={page}
          fetchOptions={fetchOptions}
          variant="subpage"
        />
      </Suspense>
    </MainLayout>
  );
}
