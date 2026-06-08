'use client';

import { BookOpen } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { BrowseCategoryFilter } from '@/components/general/BrowseCategoryFilter';
import { DailyDevotionalsSection } from './DailyDevotionalsSection';
import type { DailyDevotional } from './DevotionalsPageClient';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

interface AllDevotionalsPageClientProps {
  config: AllBrowseConfig;
  devotionals: DailyDevotional[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllDevotionalsPageClient({
  config,
  devotionals,
  pagination = null,
  initialErrorMessage = null,
}: AllDevotionalsPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={devotionals}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load devotionals"
      errorIcon={<BookOpen className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No devotionals found',
        description: 'Try adjusting your search or sort filters, or check back later.',
        icon: BookOpen,
        showDefaultActions: true,
      }}
      afterToolbar={<BrowseCategoryFilter config={config} />}
      renderListBody={({ items, pagination: listPagination }) => (
        <DailyDevotionalsSection
          devotionals={items}
          pagination={listPagination}
          presentation="browse-list"
        />
      )}
    />
  );
}
