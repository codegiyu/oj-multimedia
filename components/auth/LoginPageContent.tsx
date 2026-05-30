'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@/lib/hooks/use-google-login';
import { base64UrlDecode } from '@/lib/services/storage';
import { sanitizeInternalRedirect } from '@/lib/utils/redirect';
import { LoginFormShell } from '@/components/auth/LoginFormShell';
import { LoginGoogleButton } from '@/components/auth/LoginGoogleButton';

const DEFAULT_REDIRECT = '/account';

function getRedirectDestination(redirectTo: string): string {
  if (!redirectTo) return DEFAULT_REDIRECT;
  try {
    return sanitizeInternalRedirect(base64UrlDecode(redirectTo), DEFAULT_REDIRECT);
  } catch {
    return DEFAULT_REDIRECT;
  }
}

/**
 * Core login content: all logic (router, search params, Google login)
 * and the UI that depends on it (CTA button, loading state).
 */
export function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '';

  const { isGoogleScriptLoaded, loginLoading, handleGoogleLogin } = useGoogleLogin({
    onSuccess: () => router.replace(getRedirectDestination(redirectTo)),
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
