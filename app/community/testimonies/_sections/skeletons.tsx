'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function FeaturedTestimoniesSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

export function AllTestimoniesSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}
