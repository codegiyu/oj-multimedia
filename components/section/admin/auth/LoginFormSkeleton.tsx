'use client';

import { Skeleton } from '@/components/ui/skeleton';

/** Non-interactive skeleton that mimics the login form layout for Suspense fallback. */
export function LoginFormSkeleton() {
  return (
    <div className="space-y-10" aria-hidden>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-[6px]" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-10 w-full rounded-[6px]" />
        </div>
      </div>
      <div className="space-y-2 mt-8">
        <Skeleton className="h-10 w-full rounded-[6px]" />
      </div>
    </div>
  );
}
