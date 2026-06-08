'use client';

import { Package } from 'lucide-react';
import { BrowseListPageClient } from '@/components/general/BrowseListPageClient';
import { ContentAllBrowseTypeFilter } from '@/components/general/ContentAllBrowseTypeFilter';
import { ResourceBrowseCard } from './ResourceBrowseCard';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';
import type { ResourceBrowseItem } from '@/lib/utils/resourceBrowse';

const RESOURCE_GRID_CLASS = 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

interface AllResourcesPageClientProps {
  config: AllBrowseConfig;
  items: ResourceBrowseItem[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

export function AllResourcesPageClient({
  config,
  items,
  pagination = null,
  initialErrorMessage = null,
}: AllResourcesPageClientProps) {
  return (
    <BrowseListPageClient
      config={config}
      items={items}
      pagination={pagination}
      initialErrorMessage={initialErrorMessage}
      errorTitle="Unable to load resources"
      errorIcon={<Package className="w-8 h-8 text-destructive" />}
      empty={{
        title: 'No resources found',
        description:
          'Try adjusting your search, sort, or type filters, or check back when new resources are published.',
        icon: Package,
        actionLabel: 'Back to Resources',
        actionHref: '/community/resources',
      }}
      gridClassName={RESOURCE_GRID_CLASS}
      listId="all-resources-browse"
      toolbarChildren={<ContentAllBrowseTypeFilter config={config} />}
      emptyInGrid
      renderItem={(item, index) => (
        <ResourceBrowseCard key={item.data._id} item={item} index={index} />
      )}
    />
  );
}
