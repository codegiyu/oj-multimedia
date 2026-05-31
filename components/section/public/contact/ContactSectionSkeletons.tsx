'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ContactInfoDetailsSkeleton() {
  return (
    <div className="grid gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SocialsLinksSkeleton() {
  return (
    <div className="mt-10 pt-8 border-t border-secondary-foreground/10">
      <Skeleton className="h-5 w-24 mb-4" />
      <div className="flex gap-3">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="size-10 rounded-full" />
      </div>
    </div>
  );
}

export function MapSectionSkeleton() {
  return <Skeleton className="w-full h-[400px] md:h-[500px] rounded-none" />;
}
