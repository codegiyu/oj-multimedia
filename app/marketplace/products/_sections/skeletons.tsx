'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/skeletons';

export function ProductsCategoriesAsideSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i}>
          <Skeleton className="h-10 w-full rounded-lg" />
        </li>
      ))}
    </ul>
  );
}

export function ProductsSubcategoriesSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full" />
      ))}
    </div>
  );
}

export function ProductsGridSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
