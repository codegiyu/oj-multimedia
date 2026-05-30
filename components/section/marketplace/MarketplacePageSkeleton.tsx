'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PageSkeletonShell,
  SectionHeaderSkeleton,
  CardGridSkeleton,
  ProductCardSkeleton,
} from '@/components/skeletons';

export function MarketplacePageSkeleton() {
  return (
    <PageSkeletonShell label="Loading marketplace">
      <SectionContainer className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 max-w-full mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-11 w-36 rounded-md" />
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton showViewAll={false} />
          <CardGridSkeleton
            count={6}
            gridClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rounded-xl border border-border/50 p-6">
              <Skeleton className="h-5 w-20 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          </CardGridSkeleton>
        </div>
      </SectionContainer>

      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton />
          <CardGridSkeleton
            count={4}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCardSkeleton />
          </CardGridSkeleton>
        </div>
      </SectionContainer>

      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton />
          <CardGridSkeleton
            count={4}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCardSkeleton />
          </CardGridSkeleton>
        </div>
      </SectionContainer>

      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton />
          <CardGridSkeleton count={3} gridClassName="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border/50 p-6">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </CardGridSkeleton>
        </div>
      </SectionContainer>

      <SectionContainer className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeaderSkeleton showViewAll={false} />
          <CardGridSkeleton count={3} gridClassName="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border/50 p-6">
              <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-28 mx-auto mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-24 mx-auto rounded-md" />
            </div>
          </CardGridSkeleton>
        </div>
      </SectionContainer>
    </PageSkeletonShell>
  );
}
