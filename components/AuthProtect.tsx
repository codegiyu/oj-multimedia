/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { base64UrlEncode } from '@/lib/services/storage';
import { Loader2 } from 'lucide-react';

export interface AuthProtectProps extends PropsWithChildren {
  /** Route to redirect to when unauthenticated. Defaults to `/auth/login`. */
  loginRoute?: string;
}

const DEFAULT_LOGIN_ROUTE = '/auth/login';

export const AuthProtect = ({ children, loginRoute = DEFAULT_LOGIN_ROUTE }: AuthProtectProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    user,
    initLoading,
    actions: { initSession },
  } = useAuthStore(state => state);

  const [isChecking, setIsChecking] = useState(true);
  const sessionInitializedRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!sessionInitializedRef.current && !user && !initLoading) {
        sessionInitializedRef.current = true;
        await initSession();
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [user, initLoading]);

  useEffect(() => {
    if (isChecking || initLoading) return;

    if (!user) {
      const fullUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      const encodedRedirect = base64UrlEncode(fullUrl);
      const separator = loginRoute.includes('?') ? '&' : '?';
      router.replace(`${loginRoute}${separator}redirectTo=${encodedRedirect}`);
    }
  }, [user, isChecking, initLoading, pathname, searchParams, router, loginRoute]);

  if (isChecking || initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
