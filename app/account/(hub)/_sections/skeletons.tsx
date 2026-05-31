'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/skeletons';
import {
  DashboardBannerSkeleton,
  DashboardStatGridSkeleton,
  DashboardPageHeaderSkeleton,
  DashboardQuickLinkGridSkeleton,
} from '@/components/section/account/skeletons/DashboardSkeletons';

export function AccountHubProfileSectionSkeleton() {
  return <DashboardBannerSkeleton />;
}

export function AccountHubOrdersSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-border/30 pb-3 last:border-0">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AccountHubWishlistSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function AccountHubStatsRowSkeleton() {
  return <DashboardStatGridSkeleton count={4} />;
}

export function AccountHubQuickLinksSkeleton() {
  return (
    <div className="space-y-4">
      <DashboardPageHeaderSkeleton />
      <DashboardQuickLinkGridSkeleton count={6} />
    </div>
  );
}
