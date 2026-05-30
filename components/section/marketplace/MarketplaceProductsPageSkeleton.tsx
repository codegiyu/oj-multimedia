'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';
import { PageSkeletonShell, ProductCardSkeleton, CardGridSkeleton } from '@/components/skeletons';

export function MarketplaceProductsPageSkeleton() {
  return (
    <PageSkeletonShell label="Loading products">
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-56 shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-primary" />
                <Skeleton className="h-5 w-24" />
              </div>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </ul>
            </aside>
            <div className="flex-1">
              <Skeleton className="h-9 w-48 mb-6" />
              <CardGridSkeleton
                count={6}
                gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCardSkeleton />
              </CardGridSkeleton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageSkeletonShell>
  );
}
