'use client';

import { NewLayout } from '@/components/layout/NewLayout';
import { HeroSection } from './HeroSection';
import { DailyDevotionals } from './DailyDevotionals';
import { BibleStudySeries } from './BibleStudySeries';
import { PrayerPoints } from './PrayerPoints';
import { ChristianLivingTips } from './ChristianLivingTips';
import { MarriageAndFamily } from './MarriageAndFamily';
import { Testimonies } from './Testimonies';

export const NewDevotionalsPageClient = () => {
  return (
    <NewLayout>
      <HeroSection />
      <DailyDevotionals />
      <BibleStudySeries />
      <PrayerPoints />
      <ChristianLivingTips />
      <MarriageAndFamily />
      <Testimonies />
    </NewLayout>
  );
};
