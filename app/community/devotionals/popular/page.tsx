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
  title: 'Popular Devotionals - Most Read',
  description: 'Discover the most popular and widely read devotionals in our community.',
};

export const dynamic = 'force-dynamic';

async function generatePopularDevotionalsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const popularDevotionals: DailyDevotional[] = DEVOTIONALS_ITEMS.filter(
    item =>
      item.isDaily &&
      (item.isPopular || item.isTrending) &&
      item.verse !== undefined &&
      item.date !== undefined
  )
    .sort((a, b) => (b.views || 0) - (a.views || 0))
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
    popularDevotionals,
  };
}

interface PopularDevotionalsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PopularDevotionalsPage({
  searchParams,
}: PopularDevotionalsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generatePopularDevotionalsData();

  const filteredData = {
    popularDevotionals: filterByCategory(data.popularDevotionals, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Popular Devotionals"
        titleHighlight="Popular"
        description="Discover the most popular and widely read devotionals in our community. These are the devotionals that have touched the most hearts."
        badgeText="Most Read"
        badgeIcon="TrendingUp"
        backUrl="/community/devotionals"
        backLabel="Back to Devotionals"
        stats={[{ icon: 'TrendingUp', text: 'Most popular' }, { text: 'Community favorites' }]}
      />
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <DailyDevotionalsSection devotionals={filteredData.popularDevotionals} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
