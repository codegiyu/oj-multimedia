'use client';

import { MusicCardSkeleton } from './MusicCardSkeleton';
import { cn } from '@/lib/utils';

export interface AlbumCardSkeletonProps {
  strip?: boolean;
  className?: string;
}

export function AlbumCardSkeleton({ strip = false, className }: AlbumCardSkeletonProps) {
  const card = <MusicCardSkeleton className={className} />;

  if (!strip) {
    return card;
  }

  return <div className={cn('min-w-[260px] max-w-[260px] shrink-0', className)}>{card}</div>;
}
