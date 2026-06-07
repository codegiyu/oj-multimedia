'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton } from '@/components/skeletons';

export function PrayerRequestsBrowseSkeleton() {
  return (
    <SectionSkeleton sectionClassName="pb-0">
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}
