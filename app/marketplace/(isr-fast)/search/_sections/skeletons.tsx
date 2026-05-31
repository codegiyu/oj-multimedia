'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/skeletons';

export function SearchFilterSkeleton() {
  return <Skeleton className="h-10 w-40 rounded-md" />;
}

export function SearchProductsResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
