'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { ContentAllBrowseToolbar } from '@/components/general/ContentAllBrowseToolbar';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { ContentBrowseList } from '@/components/general/ContentBrowseList';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { Pagination } from '@/lib/types/pagination';

export type BrowseListEmptyConfig = {
  title: string;
  description: string;
  icon: LucideIcon;
  showDefaultActions?: boolean;
  actionLabel?: string;
  actionHref?: string;
};

export type BrowseListPageClientProps<TItem> = {
  config: AllBrowseConfig;
  items: TItem[];
  pagination?: Pagination | null;
  initialErrorMessage?: string | null;
  errorTitle: string;
  errorIcon: ReactNode;
  empty: BrowseListEmptyConfig;
  gridClassName?: string;
  listId?: string;
  toolbarChildren?: ReactNode;
  afterToolbar?: ReactNode;
  renderItem?: (item: TItem, index: number) => ReactNode;
  /** When set, replaces the default grid/empty list rendering (e.g. devotionals section). */
  renderListBody?: (ctx: { items: TItem[]; pagination: Pagination | null }) => ReactNode;
  /** Render empty state inside the browse grid (polls pattern). */
  emptyInGrid?: boolean;
};

export function BrowseListPageClient<TItem>({
  config,
  items,
  pagination = null,
  initialErrorMessage = null,
  errorTitle,
  errorIcon,
  empty,
  gridClassName,
  listId,
  toolbarChildren,
  afterToolbar,
  renderItem,
  renderListBody,
  emptyInGrid = false,
}: BrowseListPageClientProps<TItem>) {
  const router = useRouter();

  if (initialErrorMessage && items.length === 0) {
    return (
      <SectionContainer>
        <DataLoadError
          title={errorTitle}
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={errorIcon}
        />
      </SectionContainer>
    );
  }

  const partialErrorBanner = initialErrorMessage ? (
    <div className="container mx-auto px-4 mb-4">
      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
        <span>{initialErrorMessage}</span>
        <Button variant="outline" size="sm" onClick={() => router.refresh()}>
          Retry
        </Button>
      </div>
    </div>
  ) : null;

  const emptyState = (
    <SectionEmptyState
      title={empty.title}
      description={empty.description}
      icon={empty.icon}
      showDefaultActions={empty.showDefaultActions}
      actionLabel={empty.actionLabel}
      actionHref={empty.actionHref}
    />
  );

  let listSection: ReactNode;

  if (renderListBody) {
    listSection = renderListBody({ items, pagination });
  } else if (items.length === 0 && !emptyInGrid) {
    listSection = <SectionContainer>{emptyState}</SectionContainer>;
  } else if (emptyInGrid) {
    listSection = (
      <ContentBrowseList id={listId} pagination={pagination} gridClassName={gridClassName}>
        {items.length === 0 ? (
          <div className="col-span-full">{emptyState}</div>
        ) : (
          items.map((item, index) => renderItem?.(item, index))
        )}
      </ContentBrowseList>
    );
  } else {
    listSection = (
      <ContentBrowseList id={listId} pagination={pagination} gridClassName={gridClassName}>
        {items.map((item, index) => renderItem?.(item, index))}
      </ContentBrowseList>
    );
  }

  return (
    <>
      <SectionContainer className="pb-0">
        <ContentAllBrowseToolbar config={config}>{toolbarChildren}</ContentAllBrowseToolbar>
      </SectionContainer>
      {afterToolbar}
      {partialErrorBanner}
      {listSection}
    </>
  );
}
