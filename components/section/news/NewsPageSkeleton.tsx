'use client';

import { PageSkeletonShell } from '@/components/skeletons';
import { NewsHubPageSkeleton } from '@/app/news/_sections/skeletons';

export const NewsPageSkeleton = () => {
  return (
    <PageSkeletonShell label="Loading news page">
      <NewsHubPageSkeleton />
    </PageSkeletonShell>
  );
};
