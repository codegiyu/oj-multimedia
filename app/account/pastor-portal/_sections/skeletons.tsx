'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { DashboardStatGridSkeleton } from '@/components/section/account/skeletons/DashboardSkeletons';

export function PastorPortalStatsSectionSkeleton() {
  return <DashboardStatGridSkeleton count={4} />;
}

export function PastorPortalQuestionsSectionSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-40" />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="space-y-2 border-b border-border/30 pb-3 last:border-0">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function PastorQuestionsListSectionSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function PastorMeSectionSkeleton() {
  return <Skeleton className="h-4 w-48" />;
}
