'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { MusicCardSkeleton } from '@/components/skeletons';

export function MusicDetailPageSkeleton() {
  return (
    <article className="min-h-screen">
      <Skeleton className="h-[400px] md:h-[500px] w-full rounded-none" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </article>
  );
}

export function MusicRelatedSectionSkeleton() {
  return (
    <div className="mt-12 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <MusicCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
