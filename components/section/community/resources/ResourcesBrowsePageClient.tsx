'use client';

import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { ResourceTypeFilterBar, type ResourceTypeCounts } from './ResourceTypeFilterBar';
import { ResourceBrowseCard } from './ResourceBrowseCard';
import type { Pagination } from '@/lib/types/pagination';
import type { ResourceBrowseFilter, ResourceBrowseItem } from '@/lib/utils/resourceBrowse';

interface ResourcesBrowsePageClientProps {
  items: ResourceBrowseItem[];
  activeType: ResourceBrowseFilter;
  counts: ResourceTypeCounts;
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

const RESOURCE_GRID_CLASS = 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

export function ResourcesBrowsePageClient({
  items,
  activeType,
  counts,
  pagination = null,
  initialErrorMessage = null,
}: ResourcesBrowsePageClientProps) {
  const router = useRouter();

  if (initialErrorMessage && items.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load resources"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Package className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <ContentBrowseList
      id="resources-browse"
      pagination={pagination}
      gridClassName={RESOURCE_GRID_CLASS}
      toolbar={<ResourceTypeFilterBar activeType={activeType} counts={counts} />}>
      {items.length === 0 ? (
        <div className="col-span-full">
          <SectionEmptyState
            title="No resources in this category"
            description="Try another category or check back when new resources are published."
            icon={Package}
            actionLabel="View all resources"
            actionHref="/community/resources"
          />
        </div>
      ) : (
        items.map((item, index) => (
          <ResourceBrowseCard key={item.data._id} item={item} index={index} />
        ))
      )}
    </ContentBrowseList>
  );
}
