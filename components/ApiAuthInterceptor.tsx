'use client';

import { useEffect } from 'react';
import { api } from '@/lib/services/callApi';
import { getRouter } from '@/lib/utils/navigation';
import { base64UrlEncode } from '@/lib/services/storage';
import { getQueryParam } from '@/lib/utils/general';

function loginRedirectPath(): string {
  const isAdminSurface =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const loginRoute = isAdminSurface ? '/admin/auth/login' : '/auth/login';
  const redirectQueryValue = getQueryParam('redirectTo');
  const currentPath = typeof window !== 'undefined' ? (window.location.pathname ?? '') : '';
  const redirectToValue = redirectQueryValue || (currentPath ? base64UrlEncode(currentPath) : '');

  return redirectToValue
    ? `${loginRoute}?redirectTo=${encodeURIComponent(redirectToValue)}`
    : loginRoute;
}

export function ApiAuthInterceptor() {
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          getRouter()?.replace(loginRedirectPath());
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);

  return null;
}
