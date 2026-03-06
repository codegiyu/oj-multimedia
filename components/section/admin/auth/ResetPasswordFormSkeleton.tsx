'use client';

import { Skeleton } from '@/components/ui/skeleton';

/** Non-interactive skeleton for reset password form (Suspense fallback). */
export function ResetPasswordFormSkeleton() {
  return (
    <div className="space-y-10" aria-hidden>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-[6px]" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full rounded-[6px]" />
        </div>
      </div>
      <div className="space-y-2 mt-8">
        <Skeleton className="h-10 w-full rounded-[6px]" />
        <p className="text-center text-sm text-muted-foreground mt-4">
          <Skeleton className="h-4 w-44 inline-block" />
        </p>
      </div>
    </div>
  );
}
