import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { BibleStudySeriesSection } from '@/components/section/community/devotionals/BibleStudySeriesSection';
import { DEVOTIONALS_ITEMS } from '@/lib/constants/community/devotionals';
import type { BibleStudy } from '@/components/section/community/devotionals/DevotionalsPageClient';

export const metadata: Metadata = {
  title: 'Bible Study Series - Deep Dive into Scripture',
  description:
    "Explore comprehensive Bible study series designed to deepen your understanding of God's Word.",
};

export const dynamic = 'force-dynamic';

async function generateBibleStudyData() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const bibleStudySeries: BibleStudy[] = DEVOTIONALS_ITEMS.filter(
    item =>
      item.isBibleStudy &&
      item.description !== undefined &&
      item.lessons !== undefined &&
      item.duration !== undefined &&
      item.participants !== undefined &&
      item.status !== undefined
  ).map(item => ({
    _id: item._id,
    title: item.title,
    description: item.description!,
    lessons: item.lessons!,
    duration: item.duration!,
    participants: item.participants!,
    status: item.status!,
  }));

  return {
    bibleStudySeries,
  };
}

export default async function BibleStudyPage() {
  const data = await generateBibleStudyData();

  return (
    <MainLayout>
      <SubPageHero
        title="Bible Study Series"
        titleHighlight="Bible Study"
        description="Explore comprehensive Bible study series designed to deepen your understanding of God's Word. Join thousands of participants in these transformative studies."
        badgeText="In-Depth Studies"
        badgeIcon="BookOpen"
        backUrl="/community/devotionals"
        backLabel="Back to Devotionals"
        stats={[{ icon: 'BookOpen', text: 'Deep learning' }, { text: 'Community studies' }]}
      />
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <div className="container mx-auto px-4 pb-16">
          <BibleStudySeriesSection series={data.bibleStudySeries} />
        </div>
      </Suspense>
    </MainLayout>
  );
}
