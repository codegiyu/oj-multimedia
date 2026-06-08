/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { base64UrlDecode, base64UrlEncode } from '@/lib/services/storage';
import { sanitizeInternalRedirect } from '@/lib/utils/redirect';
import { Loader2 } from 'lucide-react';

export type SessionGateProps = PropsWithChildren<{
  loginRoute: string;
  /** When set, paths in this set skip the authenticated-user requirement. */
  unprotectedRoutes?: ReadonlySet<string>;
  /** Where to send authenticated users who land on an auth screen. */
  authenticatedHomePath?: string;
  /** When true, auth-route redirects honour pauseNavigatingAwayFromAuth (admin flows). */
  respectPauseNavigatingAwayFromAuth?: boolean;
  /** Optional predicate for auth-route detection (defaults to pathname includes loginRoute segment). */
  isAuthRoute?: (pathname: string) => boolean;
  buildRedirectTarget?: (pathname: string, searchParams: URLSearchParams) => string;
}>;

const DEFAULT_ACCOUNT_HOME = '/account';

function defaultBuildRedirectTarget(pathname: string, searchParams: URLSearchParams): string {
  return pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
}

function SessionGateLoading({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function SessionGate({
  children,
  loginRoute,
  unprotectedRoutes,
  authenticatedHomePath = DEFAULT_ACCOUNT_HOME,
  respectPauseNavigatingAwayFromAuth = false,
  isAuthRoute = pathname => pathname.includes('/auth/'),
  buildRedirectTarget = defaultBuildRedirectTarget,
}: SessionGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '';

  const {
    user,
    initLoading,
    pauseNavigatingAwayFromAuth,
    actions: { initSession },
  } = useAuthStore(state => state);

  const [isChecking, setIsChecking] = useState(true);
  const sessionInitializedRef = useRef(false);

  const isProtectedRoute = unprotectedRoutes ? !unprotectedRoutes.has(pathname) : true;

  useEffect(() => {
    const checkAuth = async () => {
      if (unprotectedRoutes?.has(pathname)) {
        setIsChecking(false);
        return;
      }

      if (!sessionInitializedRef.current && !user && !initLoading) {
        sessionInitializedRef.current = true;
        await initSession();
      }

      setIsChecking(false);
    };

    void checkAuth();
  }, [pathname, user, initLoading, unprotectedRoutes]);

  useEffect(() => {
    if (isChecking || initLoading) return;

    const onAuthRoute = isAuthRoute(pathname);

    if (!user && isProtectedRoute) {
      const redirectTarget = buildRedirectTarget(pathname, searchParams);
      const encodedRedirect = base64UrlEncode(redirectTarget);
      const separator = loginRoute.includes('?') ? '&' : '?';
      router.replace(`${loginRoute}${separator}redirectTo=${encodeURIComponent(encodedRedirect)}`);
      return;
    }

    if (user && onAuthRoute) {
      if (respectPauseNavigatingAwayFromAuth && pauseNavigatingAwayFromAuth) {
        return;
      }

      let destination = authenticatedHomePath;

      if (redirectTo) {
        try {
          destination = sanitizeInternalRedirect(
            base64UrlDecode(redirectTo),
            authenticatedHomePath
          );
        } catch {
          destination = authenticatedHomePath;
        }
      }

      router.replace(destination);
    }
  }, [
    user,
    isChecking,
    initLoading,
    pathname,
    searchParams,
    router,
    loginRoute,
    isProtectedRoute,
    redirectTo,
    pauseNavigatingAwayFromAuth,
    respectPauseNavigatingAwayFromAuth,
    authenticatedHomePath,
    isAuthRoute,
    buildRedirectTarget,
  ]);

  if (isChecking || initLoading) {
    return <SessionGateLoading message="Loading..." />;
  }

  if (!user && isProtectedRoute) {
    return <SessionGateLoading message="Redirecting to login..." />;
  }

  return <>{children}</>;
}
