'use client';

import { Quote } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { BrowseCategoryFilter } from '@/components/general/BrowseCategoryFilter';
import { AllTestimonies } from './AllTestimonies';
import type { Testimony } from './TestimoniesPageClient';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

interface AllTestimoniesPageClientProps {
  config: AllBrowseConfig;
  testimonies: Testimony[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllTestimoniesPageClient({
  config,
  testimonies,
  pagination = null,
  initialErrorMessage = null,
}: AllTestimoniesPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={testimonies}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load testimonies"
      errorIcon={<Quote className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No testimonies found',
        description: 'Try adjusting your search or sort filters, or check back later.',
        icon: Quote,
        showDefaultActions: true,
      }}
      afterToolbar={<BrowseCategoryFilter config={config} />}
      renderListBody={({ items, pagination: listPagination }) => (
        <AllTestimonies
          testimonies={items}
          pagination={listPagination}
          presentation="browse-list"
        />
      )}
    />
  );
}
