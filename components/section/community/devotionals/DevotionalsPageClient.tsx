'use client';

import { DailyDevotionalsSection } from './DailyDevotionalsSection';
import { BibleStudySeriesSection } from './BibleStudySeriesSection';
import { PrayerPointsSection } from './PrayerPointsSection';
import { ChristianLivingTipsSection } from './ChristianLivingTipsSection';
import { MarriageAndFamilySection } from './MarriageAndFamilySection';
import { CommunityCTA } from '../../shared';

export interface DailyDevotional {
  id: number;
  title: string;
  verse: string;
  date: string;
  readingTime: string;
  category: string;
  excerpt: string;
  views: number;
}

export interface BibleStudy {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  participants: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
}

export interface PrayerPoint {
  id: number;
  title: string;
  category: string;
  points: number;
  readingTime: string;
  verse: string;
  excerpt: string;
}

export interface LivingTip {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  views: string;
  trending: boolean;
}

export interface MarriageFamily {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  articles: number;
}

interface DevotionalsPageClientProps {
  dailyDevotionals: DailyDevotional[];
  bibleStudySeries: BibleStudy[];
  prayerPoints: PrayerPoint[];
  livingTips: LivingTip[];
  marriageFamily: MarriageFamily[];
}

export const DevotionalsPageClient = ({
  dailyDevotionals,
  bibleStudySeries,
  prayerPoints,
  livingTips,
  marriageFamily,
}: DevotionalsPageClientProps) => {
  return (
    <section className="container mx-auto px-4 pb-16">
      <DailyDevotionalsSection devotionals={dailyDevotionals} />
      <BibleStudySeriesSection series={bibleStudySeries} />
      <PrayerPointsSection prayerPoints={prayerPoints} />
      <ChristianLivingTipsSection tips={livingTips} />
      <MarriageAndFamilySection content={marriageFamily} />
      <CommunityCTA />
    </section>
  );
};
