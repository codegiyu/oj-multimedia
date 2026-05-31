'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { AlbumCardSkeleton, MusicCardSkeleton, VideoCardSkeleton } from '@/components/skeletons';
import { MEDIA_BROWSE_GRID_CLASS } from '@/lib/constants/mediaCardLayout';

export function ArtistCatalogSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-32" />
      <div className={MEDIA_BROWSE_GRID_CLASS}>
        {[1, 2, 3, 4].map(i => (
          <MusicCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ArtistAlbumsSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-32" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <AlbumCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ArtistVideosSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-32" />
      <div className={MEDIA_BROWSE_GRID_CLASS}>
        {[1, 2, 3].map(i => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ArtistDetailPageSkeleton() {
  return (
    <article className="min-h-screen">
      <Skeleton className="h-72 w-full" />
      <div className="container mx-auto px-4 py-12 space-y-12">
        <ArtistAlbumsSectionSkeleton />
        <ArtistCatalogSectionSkeleton />
        <ArtistVideosSectionSkeleton />
      </div>
    </article>
  );
}
