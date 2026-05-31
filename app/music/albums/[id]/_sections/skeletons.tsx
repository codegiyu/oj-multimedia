'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function AlbumDetailPageSkeleton() {
  return (
    <article className="min-h-screen">
      <Skeleton className="h-80 w-full" />
      <div className="container mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-24 w-full" />
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </article>
  );
}
