'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { VideoCardSkeleton } from '@/components/skeletons';

export function VideoDetailPageSkeleton() {
  return (
    <article className="min-h-screen">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </article>
  );
}

export function VideoRelatedSectionSkeleton() {
  return (
    <div className="mt-12 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
