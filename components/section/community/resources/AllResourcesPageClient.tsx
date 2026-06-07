'use client';

import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { ContentAllBrowseTypeFilter } from '@/components/general/ContentAllBrowseTypeFilter';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import { ResourceBrowseCard } from './ResourceBrowseCard';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';
import type { ResourceBrowseItem } from '@/lib/utils/resourceBrowse';

interface AllResourcesPageClientProps {
  config: AllBrowseConfig;
  items: ResourceBrowseItem[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
}

const RESOURCE_GRID_CLASS = 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

export function AllResourcesPageClient({
  config,
  items,
  pagination = null,
  initialErrorMessage = null,
}: AllResourcesPageClientProps) {
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
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config}>
          <ContentAllBrowseTypeFilter config={config} />
        </ContentAllBrowseToolbar>
      </SectionContainer>
      <ContentBrowseList
        id="all-resources-browse"
        pagination={pagination}
        gridClassName={RESOURCE_GRID_CLASS}>
        {items.length === 0 ? (
          <div className="col-span-full">
            <SectionEmptyState
              title="No resources found"
              description="Try adjusting your search, sort, or type filters, or check back when new resources are published."
              icon={Package}
              actionLabel="Back to Resources"
              actionHref="/community/resources"
            />
          </div>
        ) : (
          items.map((item, index) => (
            <ResourceBrowseCard key={item.data._id} item={item} index={index} />
          ))
        )}
      </ContentBrowseList>
    </>
  );
}
