'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

/** Non-empty fallback when a portal route receives 403/404 instead of blanking. */
export function DashboardPortalForbiddenFallback({
  message = 'You do not have access to this page right now.',
  showRetry = true,
}: {
  message?: string;
  showRetry?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-[min(40vh,20rem)] flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {showRetry ? (
        <Button type="button" variant="outline" onClick={() => router.refresh()}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
