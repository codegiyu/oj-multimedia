'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Mail } from 'lucide-react';

/** Non-interactive skeleton for reset password mail notification (Suspense fallback). */
export function ResetPasswordMailNotificationSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Mail className="h-8 w-8 text-primary opacity-60" />
        </div>
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            <Skeleton className="h-4 w-40 inline-block" />
          </p>
        </div>
      </div>
    </div>
  );
}
