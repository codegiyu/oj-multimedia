'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton, SectionHeaderSkeleton } from '@/components/skeletons';

export function PromoteYourSongSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </SectionSkeleton>
  );
}

export function GetFeaturedSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </SectionSkeleton>
  );
}

export function ContactSponsorshipSectionSkeleton() {
  return (
    <SectionSkeleton>
      <SectionHeaderSkeleton />
      <Skeleton className="h-56 w-full rounded-2xl" />
    </SectionSkeleton>
  );
}
