'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SectionSkeleton } from './SectionSkeleton';
import { cn } from '@/lib/utils';

export interface CTASectionSkeletonProps {
  sectionClassName?: string;
  innerClassName?: string;
}

export function CTASectionSkeleton({ sectionClassName, innerClassName }: CTASectionSkeletonProps) {
  return (
    <SectionSkeleton sectionClassName={cn('py-16', sectionClassName)}>
      <Skeleton className={cn('w-full rounded-3xl p-8 md:p-12', innerClassName)}>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Skeleton className="h-8 w-32 rounded-full mb-4" />
            <Skeleton className="h-10 w-full max-w-md mb-3" />
            <Skeleton className="h-10 w-4/5 max-w-sm mb-4" />
            <Skeleton className="h-4 w-full max-w-md mb-2" />
            <Skeleton className="h-4 w-5/6 max-w-md mb-6" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-36 rounded-md" />
              <Skeleton className="h-11 w-32 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl p-4 bg-background/50">
                <Skeleton className="w-8 h-8 rounded-lg mb-3" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Skeleton>
    </SectionSkeleton>
  );
}
