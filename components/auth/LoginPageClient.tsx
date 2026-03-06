'use client';

import { LoginPageLayout } from './LoginPageLayout';
import { LoginPageContent } from './LoginPageContent';
import { LoginPageSkeleton } from './LoginPageSkeleton';
import { Suspense } from 'react';

/**
 * Composition of layout + Suspense + core content.
 * Use this when you need the full login page as a single client component.
 * For the server page, prefer composing LoginPageLayout with Suspense and LoginPageContent directly.
 */
export function LoginPageClient() {
  return (
    <LoginPageLayout>
      <Suspense fallback={<LoginPageSkeleton />}>
        <LoginPageContent />
      </Suspense>
    </LoginPageLayout>
  );
}
