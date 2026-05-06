'use client';

import { type ReactNode, useTransition } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader, type PageHeaderProps } from '@/components/general/PageHeader';
import {
  FilterableDataPage,
  type FilterableDataPageProps,
} from '@/components/general/FilterableDataPage';
import { GhostBtn } from '@/components/atoms/GhostBtn';

export type { FilterableDataPageProps };

type PageHeaderPick = Pick<
  PageHeaderProps,
  'title' | 'description' | 'showBack' | 'backHref' | 'onBack'
>;

export interface AdminDashboardListLayoutProps extends PageHeaderPick {
  /** Rendered in the PageHeader actions area (e.g. primary CTA). */
  pageHeaderActions?: ReactNode;
  onRefresh?: () => void;
  listError?: string | null;
  /**
   * Custom toolbar: tabs, filters, or anything above the main region.
   * When set, `toolbarBeforeFilters` and `filterableDataPageProps` are ignored.
   */
  toolbar?: ReactNode;
  /** Shown above `FilterableDataPage` when using the default filter slot. */
  toolbarBeforeFilters?: ReactNode;
  filterableDataPageProps?: FilterableDataPageProps;
  /** Primary content (e.g. data table). */
  children: ReactNode;
  /** Drawers, dialogs, and other overlay UI. */
  extraContent?: ReactNode;
  /** Merged onto the main content wrapper (default: scrollable flex growth). */
  mainClassName?: string;
  className?: string;
}

export function AdminDashboardListLayout({
  title,
  description,
  showBack,
  backHref,
  onBack,
  pageHeaderActions,
  onRefresh,
  listError,
  toolbar,
  toolbarBeforeFilters,
  filterableDataPageProps,
  children,
  extraContent,
  mainClassName,
  className,
}: AdminDashboardListLayoutProps) {
  const [isRefreshing, startRefreshTransition] = useTransition();
  const showDefaultToolbar =
    toolbar === undefined && (toolbarBeforeFilters != null || filterableDataPageProps != null);

  return (
    <section className={cn('flex min-h-full flex-col gap-4 sm:gap-6 overflow-hidden', className)}>
      <PageHeader
        title={title}
        description={description}
        showBack={showBack}
        backHref={backHref}
        onBack={onBack}>
        {(pageHeaderActions || onRefresh) && (
          <div className="flex items-center gap-2">
            {pageHeaderActions}
            {onRefresh ? (
              <GhostBtn
                LucideIcon={RefreshCw}
                onClick={() => startRefreshTransition(onRefresh)}
                disabled={isRefreshing}
                className={cn(isRefreshing && 'animate-spin')}
              />
            ) : null}
          </div>
        )}
      </PageHeader>

      {listError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{listError}</span>
        </div>
      ) : null}

      {toolbar !== undefined ? (
        <div className="min-w-0 shrink-0">{toolbar}</div>
      ) : showDefaultToolbar ? (
        <div
          className={cn(
            'min-w-0 shrink-0',
            toolbarBeforeFilters != null &&
              filterableDataPageProps != null &&
              'space-y-4 sm:space-y-6'
          )}>
          {toolbarBeforeFilters}
          {filterableDataPageProps ? <FilterableDataPage {...filterableDataPageProps} /> : null}
        </div>
      ) : null}

      <div className={cn('min-h-0 flex-1 overflow-hidden', mainClassName)}>{children}</div>

      {extraContent}
    </section>
  );
}
