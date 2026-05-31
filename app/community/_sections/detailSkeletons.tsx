'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function CommunityRelatedSectionSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12 bg-muted/30">
      <Skeleton className="h-8 w-56 mb-6" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </section>
  );
}

export function CommunityDetailPageSkeleton() {
  return (
    <article className="min-h-screen">
      <Skeleton className="h-64 md:h-80 w-full" />
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    </article>
  );
}
