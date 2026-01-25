'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const PrayerRequestsPageSkeleton = () => {
  return (
    <section className="container mx-auto px-4 pb-16">
      {/* Active Requests Skeleton */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </section>

      {/* Submit Form Skeleton */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
