'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from './HeroSection';
import { FeaturedVerseSection } from './FeaturedVerseSection';
import { DailyDevotionalSection } from './DailyDevotionalSection';
import { LatestSermonsSection } from './LatestSermonsSection';
import { TrendingNewsSection } from './TrendingNewsSection';
import { TopChartsSection } from './TopChartsSection';
import { NewsletterSection } from './NewsletterSection';
import { PrayerRequestButton } from './PrayerRequestButton';

export const HomePageClient = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedVerseSection />
      <DailyDevotionalSection />
      <LatestSermonsSection />
      <TrendingNewsSection />
      <TopChartsSection />
      <NewsletterSection />
      <PrayerRequestButton />
    </MainLayout>
  );
};
