'use client';

import { ActivePrayerRequestsSection } from './ActivePrayerRequestsSection';
import { SubmitPrayerRequestSection } from './SubmitPrayerRequestSection';
import { AnsweredPrayersSection } from './AnsweredPrayersSection';
import { PrayerCategoriesSection } from './PrayerCategoriesSection';
import { CommunityCTA } from '../../shared';

export interface PrayerRequest {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  prayers: number;
  comments: number;
  timeAgo: string;
  urgent: boolean;
}

export interface AnsweredPrayer {
  _id: string;
  title: string;
  originalRequest: string;
  testimony: string;
  author: string;
  answeredDate: string;
  prayers: number;
}

export interface PrayerCategory {
  name: string;
  count: number;
}

// Static category definitions - hardcoded on the client side
const categoryDefinitions: Omit<PrayerCategory, 'count'>[] = [
  { name: 'Healing' },
  { name: 'Finance' },
  { name: 'Family' },
  { name: 'Career' },
  { name: 'Spiritual' },
  { name: 'Protection' },
];

interface PrayerRequestsPageClientProps {
  activeRequests: PrayerRequest[];
  answeredPrayers: AnsweredPrayer[];
  categoryCounts: Record<string, number>;
}

export const PrayerRequestsPageClient = ({
  activeRequests,
  answeredPrayers,
  categoryCounts,
}: PrayerRequestsPageClientProps) => {
  // Merge static category definitions with dynamic counts from server
  const categories: PrayerCategory[] = categoryDefinitions.map(def => ({
    name: def.name,
    count: categoryCounts[def.name] ?? 0,
  }));

  return (
    <>
      <ActivePrayerRequestsSection requests={activeRequests} />
      <SubmitPrayerRequestSection />
      <AnsweredPrayersSection prayers={answeredPrayers} />
      <PrayerCategoriesSection categories={categories} />
      <CommunityCTA />
    </>
  );
};
