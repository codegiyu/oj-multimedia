'use client';

import { HeroSection } from '@/components/section/home/new/HeroSection';
import { FeaturedGospelSong } from '@/components/section/home/new/FeaturedGospelSong';
import { VerseOfTheDayWithDevotional } from '@/components/section/home/new/VerseOfTheDayWithDevotional';
import { LatestSermons } from '@/components/section/home/new/LatestSermons';
import { TrendingGospelNews } from '@/components/section/home/new/TrendingGospelNews';
import { DownloadablesSection } from '@/components/section/home/new/DownloadablesSection';
import { NewMusicSubmissions } from '@/components/section/home/new/NewMusicSubmissions';
import { Newsletter } from '@/components/section/home/new/Newsletter';
import { TopCharts } from '@/components/section/home/new/TopCharts';
import { PrayerRequestButton } from '@/components/section/home/PrayerRequestButton';
import { NewLayout } from '@/components/layout/NewLayout';

export const NewHomePageClient = () => {
  return (
    <NewLayout>
      <HeroSection />
      <VerseOfTheDayWithDevotional />
      <FeaturedGospelSong />
      <LatestSermons />
      <TrendingGospelNews />
      <DownloadablesSection />
      <NewMusicSubmissions />
      <Newsletter />
      <TopCharts />
      <PrayerRequestButton />
    </NewLayout>
  );
};
