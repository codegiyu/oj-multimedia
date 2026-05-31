import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { DevotionalsCategoryFilter } from '@/components/section/community/devotionals/DevotionalsCategoryFilter';
import { LatestDevotionalsSection } from './_sections/LatestDevotionalsSection';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Latest Devotionals - Daily Inspiration',
  description: 'Browse the latest daily devotionals for inspiration and spiritual growth.',
};

interface LatestDevotionalsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function LatestDevotionalsPage({ searchParams }: LatestDevotionalsPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';

  return (
    <MainLayout>
      <SubPageHero
        title="Latest Devotionals"
        titleHighlight="Latest"
        description="Stay up to date with the most recent daily devotionals. Fresh inspiration delivered daily."
        badgeText="Daily Updates"
        badgeIcon="BookOpen"
        backUrl="/community/devotionals"
        backLabel="Back to Devotionals"
        stats={[{ icon: 'BookOpen', text: 'Updated daily' }, { text: 'Fresh content' }]}
      />
      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<Skeleton className="mb-6 h-10 w-full max-w-xs rounded-md" />}>
          <DevotionalsCategoryFilter />
        </Suspense>
        <Suspense fallback={<DevotionalsPageSkeleton />} key={category}>
          <LatestDevotionalsSection category={category} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
