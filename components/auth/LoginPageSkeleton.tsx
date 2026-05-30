'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { LoginFormShell } from '@/components/auth/LoginFormShell';

/**
 * Skeleton for the login page content area (button + divider + footer).
 * Used as Suspense fallback inside LoginPageLayout.
 */
export function LoginPageSkeleton() {
  return (
    <LoginFormShell variant="page" showBackToHome>
      <Skeleton className="w-full h-12 rounded-md" aria-hidden />
    </LoginFormShell>
  );
}
