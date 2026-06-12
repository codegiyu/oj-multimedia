'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { PageSkeletonShell } from '@/components/skeletons';

export function ProductDetailSkeleton() {
  return (
    <PageSkeletonShell label="Loading product">
      <SectionContainer className="marketplace-page-top">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-11 w-32 rounded-md" />
                <Skeleton className="h-11 w-36 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageSkeletonShell>
  );
}
