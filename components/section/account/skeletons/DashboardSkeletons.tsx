'use client';

import { type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell, CardGridSkeleton } from '@/components/skeletons';
import { cn } from '@/lib/utils';

export function DashboardPageHeaderSkeleton({
  actionCount = 0,
  className,
}: {
  actionCount?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {actionCount > 0 ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: actionCount }, (_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-md" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DashboardStatGridSkeleton({
  count = 4,
  gridClassName = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
}: {
  count?: number;
  gridClassName?: string;
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FilterableDataPageSkeleton({ filterCount = 1 }: { filterCount?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-md" />
      {filterCount > 0 ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: filterCount }, (_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-md" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DashboardFormCardSkeleton({ fieldRows = 3 }: { fieldRows?: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border/50 px-5 py-4 md:px-6">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-48 max-w-full" />
        </div>
      </div>
      <div className="space-y-4 px-5 py-5 md:px-6">
        {Array.from({ length: fieldRows }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardListRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 sm:flex-row sm:items-center">
          <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 max-w-xs" />
            <Skeleton className="h-4 w-1/2 max-w-[200px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccountOrderCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex gap-4 rounded-lg bg-primary/[0.05] p-4">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border/50 p-4">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardBannerSkeleton() {
  return <Skeleton className="h-32 w-full rounded-2xl" />;
}

export function DashboardQuickLinkGridSkeleton({
  count = 3,
  gridClassName = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number;
  gridClassName?: string;
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-border/50 bg-card p-5">
          <Skeleton className="h-11 w-11 rounded-xl mb-4" />
          <Skeleton className="h-5 w-28 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function DashboardUploadListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="border-b border-border/50 p-4">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="divide-y divide-border/50">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function VendorChartSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Skeleton className="h-48 rounded-xl lg:col-span-3" />
      <Skeleton className="h-48 rounded-xl lg:col-span-2" />
    </div>
  );
}

export function AccountPageShell({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <PageSkeletonShell label={label} className={cn('space-y-8', className)}>
      {children}
    </PageSkeletonShell>
  );
}

export function AccountStatusPillsSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-9 w-20 rounded-full shrink-0" />
      ))}
    </div>
  );
}

export { CardGridSkeleton };
