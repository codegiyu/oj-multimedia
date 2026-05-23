'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const NewsPageSkeleton = () => {
  return (
    <>
      {/* Categories Skeleton */}
      <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Skeleton */}
      <section className="py-12">
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

      {/* Main Content with Sidebar */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* News Feed Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="w-full md:w-1/3 h-48 md:h-full aspect-video md:aspect-auto" />
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending Sidebar Skeleton */}
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <div className="bg-card rounded-2xl p-6">
                  <Skeleton className="h-6 w-32 mb-6" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video News Skeleton */}
      <section className="py-12 bg-muted/30">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </section>
    </>
  );
};
