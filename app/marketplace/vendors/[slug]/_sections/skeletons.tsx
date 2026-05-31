'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/skeletons';
import { SectionContainer } from '@/components/general/SectionContainer';

export function VendorProfileSectionSkeleton() {
  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </SectionContainer>
  );
}

export function VendorProductsSectionSkeleton() {
  return (
    <SectionContainer className="pb-16 md:pb-20 pt-0">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
