'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function MarketplaceVendorsPageSkeleton() {
  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-48 mb-8" />
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-5 w-80 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-6">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-40 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
