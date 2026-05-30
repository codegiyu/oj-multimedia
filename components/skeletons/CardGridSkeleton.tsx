'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardGridSkeletonProps {
  children: ReactNode;
  count?: number;
  gridClassName?: string;
  className?: string;
}

export function CardGridSkeleton({
  children,
  count = 6,
  gridClassName = 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4',
  className,
}: CardGridSkeletonProps) {
  return (
    <div className={cn(gridClassName, className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  );
}
