'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Minimal skeleton for the search header + form area.
 * Used as Suspense fallback when SearchPageClient (nuqs/query state) is loading.
 */
export function SearchFormSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-64 mx-auto mb-6" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </>
  );
}

export function SearchFormAreaSkeleton() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12">
          <SearchFormSkeleton />
        </div>
      </div>
    </div>
  );
}
