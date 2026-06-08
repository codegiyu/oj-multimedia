'use client';

import { HandHeart } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { BrowseCategoryFilter } from '@/components/general/BrowseCategoryFilter';
import { ContentAllBrowseStatusFilter } from '@/components/general/ContentAllBrowseStatusFilter';
import { ActivePrayerRequestsSection } from './ActivePrayerRequestsSection';
import { AnsweredPrayersSection } from './AnsweredPrayersSection';
import type { AnsweredPrayer, PrayerRequest } from './PrayerRequestsPageClient';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

interface AllPrayerRequestsPageClientProps {
  config: AllBrowseConfig;
  listKind: 'active' | 'answered';
  activeRequests: PrayerRequest[];
  answeredPrayers: AnsweredPrayer[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllPrayerRequestsPageClient({
  config,
  listKind,
  activeRequests,
  answeredPrayers,
  pagination = null,
  initialErrorMessage = null,
}: AllPrayerRequestsPageClientProps) {
  const items = listKind === 'answered' ? answeredPrayers : activeRequests;

  return (
    <BrowseListPageClient<PrayerRequest | AnsweredPrayer>
      config={config}
      items={items}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load prayer requests"
      errorIcon={<HandHeart className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No prayer requests found',
        description: 'Try adjusting your search or filters, or check back later.',
        icon: HandHeart,
        showDefaultActions: true,
      }}
      toolbarChildren={<ContentAllBrowseStatusFilter config={config} />}
      afterToolbar={<BrowseCategoryFilter config={config} />}
      renderListBody={() =>
        listKind === 'answered' ? (
          <AnsweredPrayersSection
            prayers={answeredPrayers}
            pagination={pagination}
            presentation="browse-list"
          />
        ) : (
          <ActivePrayerRequestsSection
            requests={activeRequests}
            pagination={pagination}
            presentation="browse-list"
          />
        )
      }
    />
  );
}
