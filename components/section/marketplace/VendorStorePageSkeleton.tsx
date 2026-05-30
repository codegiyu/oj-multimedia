'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell, ProductCardSkeleton, CardGridSkeleton } from '@/components/skeletons';

export function VendorStorePageSkeleton() {
  return (
    <PageSkeletonShell label="Loading vendor store">
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-64 mb-8" />
          <div className="rounded-xl border border-border/50 p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Skeleton className="w-24 h-24 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 text-center md:text-left w-full">
                <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-6 w-24 mb-6" />
          <CardGridSkeleton
            count={4}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCardSkeleton />
          </CardGridSkeleton>
        </div>
      </SectionContainer>
    </PageSkeletonShell>
  );
}
