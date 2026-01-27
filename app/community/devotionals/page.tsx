import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DevotionalsHero } from '@/components/section/community/devotionals/DevotionalsHero';
import {
  BibleStudy,
  DevotionalsPageClient,
  type DailyDevotional,
  type PrayerPoint,
  type LivingTip,
  type MarriageFamily,
} from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DevotionalsPageSkeleton } from '@/components/section/community/devotionals/DevotionalsPageSkeleton';
import { DEVOTIONALS_ITEMS } from '@/lib/constants/community/devotionals';

export const metadata: Metadata = {
  title: 'Devotionals - Daily Inspiration & Bible Study',
  description:
    'Explore daily devotionals, Bible study series, prayer points, Christian living tips, and marriage & family guidance. Grow in your faith with inspiring content.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate devotionals data from central constants
async function generateDevotionalsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter and transform daily devotionals (limit to 4)
  const dailyDevotionals: DailyDevotional[] = DEVOTIONALS_ITEMS.filter(
    item => item.isDaily && item.verse !== undefined && item.date !== undefined
  )
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: item.title,
      verse: item.verse!,
      date: item.date!,
      readingTime: item.readingTime || '5 min',
      category: item.category,
      excerpt: item.excerpt || '',
      views: item.views || 0,
    }));

  // Filter and transform Bible study series
  const bibleStudySeries: BibleStudy[] = DEVOTIONALS_ITEMS.filter(
    item =>
      item.isBibleStudy &&
      item.description !== undefined &&
      item.lessons !== undefined &&
      item.duration !== undefined &&
      item.participants !== undefined &&
      item.status !== undefined
  ).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description!,
    lessons: item.lessons!,
    duration: item.duration!,
    participants: item.participants!,
    status: item.status!,
  }));

  // Filter and transform prayer points
  const prayerPoints: PrayerPoint[] = DEVOTIONALS_ITEMS.filter(
    item =>
      item.isPrayerPoint &&
      item.points !== undefined &&
      item.verse !== undefined &&
      item.excerpt !== undefined
  ).map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    points: item.points!,
    readingTime: item.readingTime || '3 min',
    verse: item.verse!,
    excerpt: item.excerpt!,
  }));

  // Filter and transform living tips
  const livingTips: LivingTip[] = DEVOTIONALS_ITEMS.filter(
    item => item.isLivingTip && item.excerpt !== undefined
  ).map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    excerpt: item.excerpt!,
    views: item.views?.toString() || '0',
    trending: item.trending || false,
  }));

  // Filter and transform marriage/family content
  const marriageFamily: MarriageFamily[] = DEVOTIONALS_ITEMS.filter(
    item => item.isMarriageFamily && item.excerpt !== undefined && item.articles !== undefined
  ).map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    excerpt: item.excerpt!,
    articles: item.articles!,
  }));

  return {
    dailyDevotionals,
    bibleStudySeries,
    prayerPoints,
    livingTips,
    marriageFamily,
  };
}

export default async function CommunityDevotionalsPage() {
  const devotionalsData = await generateDevotionalsData();

  return (
    <MainLayout>
      <DevotionalsHero />
      <Suspense fallback={<DevotionalsPageSkeleton />}>
        <DevotionalsPageClient {...devotionalsData} />
      </Suspense>
    </MainLayout>
  );
}
