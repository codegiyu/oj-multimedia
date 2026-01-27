import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { SermonsPageSkeleton } from '@/components/section/community/sermons/SermonsPageSkeleton';
import { PopularSermonsSection } from '@/components/section/community/sermons/PopularSermonsSection';
import { SERMONS_ITEMS } from '@/lib/constants/community/sermons';
import type { PopularSermon } from '@/components/section/community/sermons/SermonsPageClient';

export const metadata: Metadata = {
  title: 'Popular Sermons - Most Watched',
  description: 'Discover the most popular and widely watched sermons in our community.',
};

export const dynamic = 'force-dynamic';

async function generatePopularSermonsData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const popularSermons: PopularSermon[] = SERMONS_ITEMS.filter(
    item => item.isPopular && item.views !== undefined && item.thumbnail !== undefined
  )
    .sort((a, b) => {
      const viewsA = parseInt(a.views?.replace('K', '000').replace('M', '000000') || '0');
      const viewsB = parseInt(b.views?.replace('K', '000').replace('M', '000000') || '0');
      return viewsB - viewsA;
    })
    .map(item => ({
      id: item.id,
      title: item.title,
      pastor: item.pastor,
      duration: item.duration,
      views: item.views!,
      thumbnail: item.thumbnail!,
      category: item.category || item.topic || '',
      trending: item.isTrending || false,
    }));

  return {
    popularSermons,
  };
}

export default async function PopularSermonsPage() {
  const data = await generatePopularSermonsData();

  return (
    <MainLayout>
      <SubPageHero
        title="Popular Sermons"
        titleHighlight="Popular"
        description="Discover the most popular and widely watched sermons in our community. These messages have touched the most hearts."
        badgeText="Most Watched"
        badgeIcon="TrendingUp"
        backUrl="/community/sermons"
        backLabel="Back to Sermons"
        stats={[{ icon: 'TrendingUp', text: 'Most popular' }, { text: 'Community favorites' }]}
      />
      <Suspense fallback={<SermonsPageSkeleton />}>
        <PopularSermonsSection sermons={data.popularSermons} />
      </Suspense>
    </MainLayout>
  );
}
