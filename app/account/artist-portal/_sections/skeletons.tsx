'use client';

import {
  DashboardStatGridSkeleton,
  DashboardUploadListSkeleton,
} from '@/components/section/account/skeletons/DashboardSkeletons';

export function ArtistPortalStatsSectionSkeleton() {
  return (
    <DashboardStatGridSkeleton
      count={5}
      gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    />
  );
}

export function ArtistPortalRecentUploadsSectionSkeleton() {
  return <DashboardUploadListSkeleton count={4} />;
}
