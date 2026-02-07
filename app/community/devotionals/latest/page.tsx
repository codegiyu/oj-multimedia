import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { DailyDevotionalsSection } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { filterByCategory } from '@/lib/utils/community/devotionals';
import { DEVOTIONALS_ITEMS } from '@/lib/constants/community/devotionals';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

export const metadata: Metadata = {
  title: 'Latest Devotionals - Daily Inspiration',
  description: 'Browse the latest daily devotionals for inspiration and spiritual growth.',
};

export const dynamic = 'force-dynamic';

async function generateLatestDevotionalsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const latestDevotionals: DailyDevotional[] = DEVOTIONALS_ITEMS.filter(
    item => item.isDaily && item.isLatest && item.verse !== undefined && item.date !== undefined
  )
    .sort((a, b) => {
      // Sort by date (most recent first)
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateB.localeCompare(dateA);
    })
    .map(item => ({
      _id: item._id,
      title: item.title,
      verse: item.verse!,
      date: item.date!,
      readingTime: item.readingTime || '5 min',
      category: item.category,
      excerpt: item.excerpt || '',
      views: item.views || 0,
    }));

  return {
    latestDevotionals,
  };
}

interface LatestDevotionalsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function LatestDevotionalsPage({ searchParams }: LatestDevotionalsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateLatestDevotionalsData();

  const filteredData = {
    latestDevotionals: filterByCategory(data.latestDevotionals, category),
  };

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
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <DailyDevotionalsSection devotionals={filteredData.latestDevotionals} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
