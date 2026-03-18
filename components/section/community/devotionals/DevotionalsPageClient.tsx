'use client';

import { useRouter } from 'next/navigation';
import { DailyDevotionalsSection } from './DailyDevotionalsSection';
import { BibleStudySeriesSection } from './BibleStudySeriesSection';
import { PrayerPointsSection } from './PrayerPointsSection';
import { ChristianLivingTipsSection } from './ChristianLivingTipsSection';
import { MarriageAndFamilySection } from './MarriageAndFamilySection';
import { CommunityCTA } from '../../shared';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { BookOpen } from 'lucide-react';

export interface DailyDevotional {
  _id: string;
  title: string;
  verse: string;
  date: string;
  readingTime: string;
  category: string;
  excerpt: string;
  views: number;
}

export interface BibleStudy {
  _id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  participants: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
}

export interface PrayerPoint {
  _id: string;
  title: string;
  category: string;
  points: number;
  readingTime: string;
  verse: string;
  excerpt: string;
}

export interface LivingTip {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  views: string;
  trending: boolean;
}

export interface MarriageFamily {
  _id: string;
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
  initialErrorMessage?: string | null;
}

export const DevotionalsPageClient = ({
  dailyDevotionals,
  bibleStudySeries,
  prayerPoints,
  livingTips,
  marriageFamily,
  initialErrorMessage = null,
}: DevotionalsPageClientProps) => {
  const router = useRouter();
  const hasAnyContent =
    dailyDevotionals.length > 0 ||
    bibleStudySeries.length > 0 ||
    prayerPoints.length > 0 ||
    livingTips.length > 0 ||
    marriageFamily.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load devotionals"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<BookOpen className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <DailyDevotionalsSection devotionals={dailyDevotionals} />
      <BibleStudySeriesSection series={bibleStudySeries} />
      <PrayerPointsSection prayerPoints={prayerPoints} />
      <ChristianLivingTipsSection tips={livingTips} />
      <MarriageAndFamilySection content={marriageFamily} />
      <CommunityCTA />
    </>
  );
};
