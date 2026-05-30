'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const DEFAULT_PILL_WIDTHS = ['w-20', 'w-24', 'w-28', 'w-24', 'w-32', 'w-24', 'w-28', 'w-20'];

export interface CategoryPillRowSkeletonProps {
  count?: number;
  pillWidths?: string[];
  sticky?: boolean;
  className?: string;
}

export function CategoryPillRowSkeleton({
  count = 8,
  pillWidths = DEFAULT_PILL_WIDTHS,
  sticky = false,
  className,
}: CategoryPillRowSkeletonProps) {
  return (
    <section
      className={cn(
        'py-6 border-b border-border/50',
        sticky && 'sticky top-16 bg-background/95 backdrop-blur-sm z-40',
        className
      )}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {Array.from({ length: count }, (_, i) => (
            <Skeleton
              key={i}
              className={cn('h-10 rounded-full shrink-0', pillWidths[i % pillWidths.length])}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
