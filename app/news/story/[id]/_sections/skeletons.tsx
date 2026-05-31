'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function NewsDetailPageSkeleton() {
  return (
    <article className="min-h-screen">
      <Skeleton className="h-[360px] md:h-[480px] w-full rounded-none" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </article>
  );
}

export function NewsRelatedSectionSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12 border-t border-border">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}
