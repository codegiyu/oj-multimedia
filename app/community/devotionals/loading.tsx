import { MainLayout } from '@/components/layout/MainLayout';
import { DevotionalsHero } from '@/components/section/community/devotionals/DevotionalsHero';
import { CommunityCTA } from '@/components/section/shared';
import {
  DailyDevotionalsSectionSkeleton,
  BibleStudySeriesSectionSkeleton,
  PrayerPointsSectionSkeleton,
  LivingTipsSectionSkeleton,
  MarriageFamilySectionSkeleton,
} from './_sections/skeletons';

export default function DevotionalsLoading() {
  return (
    <MainLayout>
      <DevotionalsHero />
      <DailyDevotionalsSectionSkeleton />
      <BibleStudySeriesSectionSkeleton />
      <PrayerPointsSectionSkeleton />
      <LivingTipsSectionSkeleton />
      <MarriageFamilySectionSkeleton />
      <CommunityCTA />
    </MainLayout>
  );
}
