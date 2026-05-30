'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface HorizontalRailSkeletonProps {
  children: ReactNode;
  itemWidthClass?: string;
  count?: number;
  className?: string;
}

export function HorizontalRailSkeleton({
  children,
  itemWidthClass = 'w-[200px] md:w-[240px]',
  count = 8,
  className,
}: HorizontalRailSkeletonProps) {
  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x', className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={cn(itemWidthClass, 'shrink-0 snap-start')}>
          {children}
        </div>
      ))}
    </div>
  );
}
