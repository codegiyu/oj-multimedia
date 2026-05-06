'use client';

import { useRouter } from 'next/navigation';
import { ActivePrayerRequestsSection } from './ActivePrayerRequestsSection';
import { SubmitPrayerRequestSection } from './SubmitPrayerRequestSection';
import { AnsweredPrayersSection } from './AnsweredPrayersSection';
import { PrayerCategoriesSection } from './PrayerCategoriesSection';
import { CommunityCTA } from '../../shared';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { HandHeart } from 'lucide-react';
import type { Pagination } from '@/lib/types/community';
import { PRAYER_CATEGORY_DISPLAY_VALUES } from '@/lib/constants/communityCategorySelectOptions';

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

interface PrayerRequestsPageClientProps {
  activeRequests: PrayerRequest[];
  answeredPrayers: AnsweredPrayer[];
  categoryCounts: Record<string, number>;
  activePagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export const PrayerRequestsPageClient = ({
  activeRequests,
  answeredPrayers,
  categoryCounts,
  activePagination = null,
  initialErrorMessage = null,
}: PrayerRequestsPageClientProps) => {
  const router = useRouter();
  const hasAnyContent = activeRequests.length > 0 || answeredPrayers.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load prayer requests"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<HandHeart className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  // Merge static category definitions with dynamic counts from server
  const categories: PrayerCategory[] = PRAYER_CATEGORY_DISPLAY_VALUES.map(name => ({
    name,
    count: categoryCounts[name] ?? 0,
  }));

  return (
    <>
      <ActivePrayerRequestsSection requests={activeRequests} pagination={activePagination} />
      <SubmitPrayerRequestSection />
      <AnsweredPrayersSection prayers={answeredPrayers} />
      <PrayerCategoriesSection categories={categories} />
      <CommunityCTA />
    </>
  );
};
