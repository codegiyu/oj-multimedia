'use client';

import { useRouter } from 'next/navigation';
import { HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { ContentAllBrowseStatusFilter } from '@/components/general/ContentAllBrowseStatusFilter';
import { ContentAllBrowseCategoryFilter } from '@/components/general/ContentAllBrowseCategoryFilter';
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
  const router = useRouter();
  const isEmpty =
    listKind === 'answered' ? answeredPrayers.length === 0 : activeRequests.length === 0;

  if (initialErrorMessage && isEmpty) {
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

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config}>
          <ContentAllBrowseStatusFilter config={config} />
        </ContentAllBrowseToolbar>
      </SectionContainer>
      {config.categoryScope ? (
        <ContentAllBrowseCategoryFilter
          config={
            config as AllBrowseConfig & {
              categoryScope: NonNullable<AllBrowseConfig['categoryScope']>;
            }
          }
        />
      ) : null}
      {initialErrorMessage && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialErrorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </div>
      )}
      {listKind === 'answered' ? (
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
      )}
    </>
  );
}
