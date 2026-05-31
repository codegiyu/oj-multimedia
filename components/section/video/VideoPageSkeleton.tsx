'use client';

import { PageSkeletonShell } from '@/components/skeletons';
import { VideosHubPageSkeleton } from '@/app/videos/_sections/skeletons';

export const VideoPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading videos page">
      <VideosHubPageSkeleton />
    </PageSkeletonShell>
  );
};
