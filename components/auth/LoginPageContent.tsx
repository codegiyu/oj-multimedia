'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@/lib/hooks/use-google-login';
import { resolveRedirectDestination } from '@/lib/utils/redirect';
import { LoginFormShell } from '@/components/auth/LoginFormShell';
import { LoginGoogleButton } from '@/components/auth/LoginGoogleButton';
import { AccountSuspendedView } from '@/components/auth/AccountSuspendedView';
import type { AccountSuspendedPayload } from '@/lib/types/rolePortal';

/**
 * Core login content: all logic (router, search params, Google login)
 * and the UI that depends on it (CTA button, loading state).
 */
export function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [suspendedPayload, setSuspendedPayload] = useState<AccountSuspendedPayload | null>(null);

  const { isGoogleScriptLoaded, loginLoading, handleGoogleLogin } = useGoogleLogin({
    onSuccess: () => router.replace(resolveRedirectDestination(redirectTo)),
    onSuspended: payload => setSuspendedPayload(payload),
  });

  if (suspendedPayload) {
    return (
      <LoginFormShell variant="page" showBackToHome>
        <AccountSuspendedView payload={suspendedPayload} />
      </LoginFormShell>
    );
  }

  return (
    <LoginFormShell variant="page" showBackToHome>
      <LoginGoogleButton
        onClick={handleGoogleLogin}
        disabled={!isGoogleScriptLoaded}
        loading={loginLoading}
      />
    </LoginFormShell>
  );
}
