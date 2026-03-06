'use client';

import { Skeleton } from '@/components/ui/skeleton';

/** Non-interactive skeleton for request password reset form (Suspense fallback). */
export function RequestPasswordResetFormSkeleton() {
  return (
    <div className="space-y-10" aria-hidden>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-[6px]" />
        </div>
      </div>
      <div className="space-y-2 mt-8">
        <Skeleton className="h-10 w-full rounded-[6px]" />
        <p className="text-center text-sm text-muted-foreground mt-4">
          <Skeleton className="h-4 w-48 inline-block" />
        </p>
      </div>
    </div>
  );
}
