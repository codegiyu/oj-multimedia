'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { MUSIC_RAIL_ITEM_CLASS } from '@/lib/constants/mediaCardLayout';

export interface HorizontalRailSkeletonProps {
  children: ReactNode;
  itemWidthClass?: string;
  count?: number;
  className?: string;
}

export function HorizontalRailSkeleton({
  children,
  itemWidthClass = MUSIC_RAIL_ITEM_CLASS,
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
