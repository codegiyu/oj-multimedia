'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  SectionHeaderSkeleton,
  CardGridSkeleton,
  ProductCardSkeleton,
} from '@/components/skeletons';
import { SectionContainer } from '@/components/general/SectionContainer';

export function MarketplaceCategoriesSectionSkeleton() {
  return (
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
  );
}

export function MarketplaceFeaturedProductsSectionSkeleton() {
  return (
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
  );
}

export function MarketplaceRecentProductsSectionSkeleton() {
  return (
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
  );
}

export function MarketplaceVendorsStripSectionSkeleton() {
  return (
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
  );
}
