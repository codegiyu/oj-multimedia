'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { MainLayout } from '@/components/layout/MainLayout';

export const SearchPageSkeleton = () => {
  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Search Header Skeleton */}
          <div className="max-w-3xl mx-auto mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
            {/* Search Form Skeleton */}
            <div className="relative">
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
            ))}
          </div>

          {/* Results Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-sm">
                {/* Image Skeleton */}
                <Skeleton className="aspect-square w-full" />
                {/* Content Skeleton */}
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
