'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MUSIC_RAIL_ITEM_CLASS } from '@/lib/constants/mediaCardLayout';

export function HomeAdvertStripSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <Skeleton className="w-full h-[500px] md:h-[600px] rounded-2xl border border-border/50" />
    </div>
  );
}

export function SimpleMusicRailSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div>
              <Skeleton className="h-7 md:h-8 w-36 mb-2" />
              <Skeleton className="h-4 w-48 max-w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={MUSIC_RAIL_ITEM_CLASS}>
              <div className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SimpleVideoRailSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div>
              <Skeleton className="h-7 md:h-8 w-36 mb-2" />
              <Skeleton className="h-4 w-48 max-w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-[280px] md:w-[320px] snap-start shrink-0">
              <div className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
