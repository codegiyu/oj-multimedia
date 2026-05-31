import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { BibleStudyListSection } from './_sections/BibleStudyListSection';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.slow` (3600s). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bible Study Series - Deep Dive into Scripture',
  description:
    "Explore comprehensive Bible study series designed to deepen your understanding of God's Word.",
};

export default function BibleStudyPage() {
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
      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<DevotionalsPageSkeleton />}>
          <BibleStudyListSection />
        </Suspense>
      </div>
    </MainLayout>
  );
}
