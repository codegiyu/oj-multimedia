import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { VideoCategoriesSection } from '../_sections/VideoCategoriesSection';
import { ShortFormVideosSection } from '../_sections/ShortFormVideosSection';
import { VideoCategoriesSkeleton, ShortFormVideosSectionSkeleton } from '../_sections/skeletons';

export const metadata: Metadata = {
  title: 'Short Form Videos - Quick Clips',
  description:
    'Discover short form videos - quick, engaging content perfect for quick viewing. Bite-sized entertainment and inspiration.',
};

interface ShortFormVideosPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShortFormVideosPage({ searchParams }: ShortFormVideosPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('video', params.category);

  return (
    <MainLayout>
      <SubPageHero
        title="Short Form Videos"
        titleHighlight="Short Form"
        description="Discover short form videos - quick, engaging content perfect for quick viewing. Bite-sized entertainment and inspiration."
        badgeText="Quick Clips"
        badgeIcon="Zap"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Zap', text: 'Quick content' }, { text: 'Under 2 minutes' }]}
      />
      <Suspense fallback={<VideoCategoriesSkeleton />}>
        <VideoCategoriesSection category={category} />
      </Suspense>
      <Suspense fallback={<ShortFormVideosSectionSkeleton />}>
        <ShortFormVideosSection category={category} limit={50} variant="subpage" />
      </Suspense>
    </MainLayout>
  );
}
