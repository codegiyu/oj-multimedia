'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell } from '@/components/skeletons';
import { TableContentSkeleton } from '@/components/general/TableContentSkeleton';
import type { DataTableColumn, DataTableTab } from '@/components/general/DataTable';
import { cn } from '@/lib/utils';

export function createAdminTableColumns(
  count: number
): DataTableColumn<Record<string, unknown>, unknown>[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `col-${i}`,
    header: `Column ${i + 1}`,
    cell: () => null,
    meta: { width: i === 0 ? 200 : 120 },
  }));
}

export function AdminPageHeaderSkeleton({
  showActions = true,
  className,
}: {
  showActions?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        {showActions ? (
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminFilterToolbarSkeleton({ filterCount = 1 }: { filterCount?: number }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <Skeleton className="h-10 w-full max-w-md rounded-md" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: filterCount }, (_, i) => (
          <Skeleton key={i} className="h-9 w-32 rounded-md" />
        ))}
      </div>
    </div>
  );
}

export interface AdminListPageSkeletonProps {
  label?: string;
  columnCount?: number;
  rowCount?: number;
  filterCount?: number;
  tabs?: DataTableTab[];
  activeTab?: string;
  showPageHeader?: boolean;
}

export function AdminListPageSkeleton({
  label = 'Loading admin list',
  columnCount = 6,
  rowCount = 8,
  filterCount = 1,
  tabs,
  activeTab,
  showPageHeader = true,
}: AdminListPageSkeletonProps) {
  const columns = createAdminTableColumns(columnCount);

  return (
    <PageSkeletonShell label={label} className="space-y-6">
      {showPageHeader ? <AdminPageHeaderSkeleton /> : null}
      <AdminFilterToolbarSkeleton filterCount={filterCount} />
      <TableContentSkeleton
        columns={columns}
        tabs={tabs}
        activeTab={activeTab}
        rowCount={rowCount}
        onRefresh={() => {}}
      />
    </PageSkeletonShell>
  );
}

export function AdminInlineTableSkeleton({ rowCount = 6 }: { rowCount?: number }) {
  return (
    <div className="rounded-xl border border-foreground/7 overflow-hidden">
      <div className="grid grid-cols-[80px_1fr_120px_100px_80px] gap-4 border-b border-foreground/7 bg-sidebar/75 px-4 py-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>
      {Array.from({ length: rowCount }, (_, i) => (
        <div
          key={i}
          className="grid grid-cols-[80px_1fr_120px_100px_80px] gap-4 items-center border-b border-foreground/7 px-4 py-3 last:border-0">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 max-w-xs" />
            <Skeleton className="h-3 w-1/2 max-w-[180px]" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function AdminSettingsPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading settings" className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-2">
        {Array.from({ length: 9 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
      <AdminSettingsTabContentSkeleton />
    </PageSkeletonShell>
  );
}

export function AdminSettingsTabContentSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6 grid gap-6">
      <div className="grid gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <div className="grid gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}

export function AdminProfilePageSkeleton() {
  return (
    <PageSkeletonShell label="Loading profile" className="space-y-6">
      <AdminPageHeaderSkeleton showActions={false} />
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSettingsTabContentSkeleton />
        <AdminSettingsTabContentSkeleton />
      </div>
    </PageSkeletonShell>
  );
}

export function AdminDashboardHomeSkeleton() {
  return (
    <PageSkeletonShell label="Loading dashboard" className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </PageSkeletonShell>
  );
}

export const MARKETPLACE_ADMIN_TABS: DataTableTab[] = [
  { value: 'vendors', label: 'Vendors' },
  { value: 'products', label: 'Products' },
  { value: 'orders', label: 'Orders' },
];

export function AdminMarketplacePageSkeleton() {
  return (
    <AdminListPageSkeleton
      label="Loading marketplace"
      columnCount={7}
      filterCount={2}
      tabs={MARKETPLACE_ADMIN_TABS}
      activeTab="vendors"
    />
  );
}

export function AdminHomeAdvertsPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading home adverts" className="space-y-6">
      <AdminPageHeaderSkeleton />
      <AdminFilterToolbarSkeleton filterCount={0} />
      <AdminInlineTableSkeleton rowCount={5} />
    </PageSkeletonShell>
  );
}

export function AdminContentCategoriesPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading content categories" className="space-y-6">
      <AdminPageHeaderSkeleton />
      <AdminFilterToolbarSkeleton filterCount={0} />
      <AdminInlineTableSkeleton rowCount={8} />
    </PageSkeletonShell>
  );
}
