'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

export function MarketplaceProductsPageSkeleton() {
  return (
    <MainLayout>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </Skeleton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
