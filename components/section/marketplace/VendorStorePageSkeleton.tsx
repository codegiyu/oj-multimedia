'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function VendorStorePageSkeleton() {
  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-5 w-64 mb-8" />
          <Card className="p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Skeleton className="w-24 h-24 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 text-center md:text-left">
                <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </Card>
          <Skeleton className="h-6 w-24 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="rounded-xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </Skeleton>
            ))}
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
