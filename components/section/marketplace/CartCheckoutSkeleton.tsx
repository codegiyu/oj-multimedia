'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function CartCheckoutSkeleton() {
  return (
    <MainLayout>
      <SectionContainer className="marketplace-page-top">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div>
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="space-y-4 mb-10">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4 flex flex-col sm:flex-row gap-4">
                <Skeleton className="w-full sm:w-24 h-24 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-5 w-6" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-36 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
