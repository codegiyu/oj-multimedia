'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const TestimoniesPageSkeleton = () => {
  return (
    <section className="container mx-auto px-4 pb-16">
      {/* Featured Testimonies Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Testimonies Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-9 w-20 rounded-lg" />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share Testimony Section Skeleton */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </section>
    </section>
  );
};
