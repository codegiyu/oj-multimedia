'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton for the login page content area (button + divider + footer).
 * Used as Suspense fallback inside LoginPageLayout.
 */
export function LoginPageSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <Skeleton className="w-full h-12 rounded-md" />
      <div className="relative py-6 pt-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">
            Secure authentication
          </span>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        <Skeleton className="h-3 w-64 mx-auto" />
      </p>
    </div>
  );
}
