'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@/lib/hooks/use-google-login';
import { resolveRedirectDestination } from '@/lib/utils/redirect';
import { LoginFormShell } from '@/components/auth/LoginFormShell';
import { LoginGoogleButton } from '@/components/auth/LoginGoogleButton';

/**
 * Core login content: all logic (router, search params, Google login)
 * and the UI that depends on it (CTA button, loading state).
 */
export function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const { isGoogleScriptLoaded, loginLoading, handleGoogleLogin } = useGoogleLogin({
    onSuccess: () => router.replace(resolveRedirectDestination(redirectTo)),
  });

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
