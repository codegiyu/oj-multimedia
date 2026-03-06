'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@/lib/hooks/use-google-login';
import { base64UrlDecode } from '@/lib/services/storage';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { GoogleIcon } from './GoogleIcon';
const DEFAULT_REDIRECT = '/account';

function getRedirectDestination(redirectTo: string): string {
  if (!redirectTo) return DEFAULT_REDIRECT;
  try {
    return base64UrlDecode(redirectTo);
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
    <>
      <Button
        onClick={handleGoogleLogin}
        disabled={loginLoading || !isGoogleScriptLoaded}
        variant="outline"
        className="w-full h-12 text-base font-medium border-border hover:bg-muted transition-colors">
        {loginLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <GoogleIcon className="mr-3" />
            Continue with Google
          </>
        )}
      </Button>

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
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </>
  );
}
