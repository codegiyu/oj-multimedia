import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DevotionalsHero } from '@/components/section/community/devotionals/DevotionalsHero';
import { CommunityCTA } from '@/components/section/shared';
import { DailyDevotionalsSection } from './_sections/DailyDevotionalsSection';
import { BibleStudySeriesSection } from './_sections/BibleStudySeriesSection';
import { PrayerPointsSection } from './_sections/PrayerPointsSection';
import { LivingTipsSection } from './_sections/LivingTipsSection';
import { MarriageFamilySection } from './_sections/MarriageFamilySection';
import {
  DailyDevotionalsSectionSkeleton,
  BibleStudySeriesSectionSkeleton,
  PrayerPointsSectionSkeleton,
  LivingTipsSectionSkeleton,
  MarriageFamilySectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Devotionals - Daily Inspiration & Bible Study',
  description:
    'Explore daily devotionals, Bible study series, prayer points, Christian living tips, and marriage & family guidance. Grow in your faith with inspiring content.',
};

export default function CommunityDevotionalsPage() {
  return (
    <MainLayout>
      <DevotionalsHero />
      <Suspense fallback={<DailyDevotionalsSectionSkeleton />}>
        <DailyDevotionalsSection />
      </Suspense>
      <Suspense fallback={<BibleStudySeriesSectionSkeleton />}>
        <BibleStudySeriesSection />
      </Suspense>
      <Suspense fallback={<PrayerPointsSectionSkeleton />}>
        <PrayerPointsSection />
      </Suspense>
      <Suspense fallback={<LivingTipsSectionSkeleton />}>
        <LivingTipsSection />
      </Suspense>
      <Suspense fallback={<MarriageFamilySectionSkeleton />}>
        <MarriageFamilySection />
      </Suspense>
      <CommunityCTA />
    </MainLayout>
  );
}
