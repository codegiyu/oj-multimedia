'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const ResourcesPageSkeleton = () => {
  return (
    <section className="container mx-auto px-4 pb-16">
      {/* Free Downloads Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6">
              <Skeleton className="h-16 w-16 mx-auto mb-4" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-6 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
      </section>

      {/* E-books Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="p-6">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-3 w-24 mb-4" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-56 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-6">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-3 w-24 mb-4" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beats Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-52 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-6">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-3 w-24 mb-4" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wallpapers Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-56 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden">
              <Skeleton className="aspect-[9/16] w-full" />
              <div className="p-6">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-3 w-24 mb-4" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate Products Section Skeleton */}
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-8 w-56 mx-auto mb-3" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl p-6">
              <Skeleton className="aspect-square w-full mb-4 rounded-xl" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};
