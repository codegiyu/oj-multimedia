import { useInitAuthStore } from '@/lib/store/useAuthStore';
import { clearClientAuthTokens } from './clientAuthTokens';
import { getRouter } from '@/lib/utils/navigation';
import { base64UrlEncode } from '@/lib/services/storage';
import { getQueryParam } from '@/lib/utils/general';

let unauthorizedHandling = false;

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

/** Single entry point for 401 responses — clears session once and redirects to login. */
export function handleUnauthorizedResponse(): void {
  if (typeof window === 'undefined' || unauthorizedHandling) return;

  unauthorizedHandling = true;

  try {
    useInitAuthStore.getState().actions.clearSession();
    clearClientAuthTokens();
  } catch {
    // Auth store not available during SSR or early bootstrap
  }

  getRouter()?.replace(loginRedirectPath());

  window.setTimeout(() => {
    unauthorizedHandling = false;
  }, 500);
}

/** @internal Test-only reset for unit tests. */
export function resetUnauthorizedHandlingForTests(): void {
  unauthorizedHandling = false;
}
