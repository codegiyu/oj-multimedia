'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const HomePageSkeleton = () => {
  return (
    <>
      {/* Trending Music Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Videos Section Skeleton */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <Skeleton key={i} className="h-10 w-28 rounded-full shrink-0" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Charts Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Songs Chart */}
            <div className="bg-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
              <div className="space-y-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rising Artists */}
            <div className="bg-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div>
                    <Skeleton className="h-6 w-28 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="text-center">
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-4 w-20 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section Skeleton */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] rounded-2xl" />
            <div className="grid gap-6">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4 bg-card rounded-2xl p-4">
                  <Skeleton className="w-[140px] h-full aspect-video rounded-xl shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-20 mb-2 rounded-full" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4">
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section Skeleton */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-6 w-40" />
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-2xl p-4">
                  <div className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
                <Skeleton className="h-3 w-24 mt-3" />
              </div>
              <div className="bg-card rounded-2xl p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </section>
    </>
  );
};
