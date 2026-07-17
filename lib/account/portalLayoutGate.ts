/** Prefetch/deferred auth responses should not surface as portal load errors. */
export function isDeferredPortalAuthResponse(responseCode: number | undefined): boolean {
  return responseCode === 204;
}

/**
 * User-facing portal load error. Never leak 5xx / unknown upstream messages —
 * those use `fallback`. Client/4xx messages (except 403/404/204) may pass through.
 */
export function portalLayoutLoadError(
  isError: boolean,
  responseCode: number | undefined,
  message: string | undefined,
  fallback: string
): string | null {
  if (!isError) return null;
  if (responseCode === 403 || responseCode === 404 || isDeferredPortalAuthResponse(responseCode)) {
    return null;
  }

  if (responseCode == null || responseCode >= 500) {
    return fallback;
  }

  return message ?? fallback;
}

/**
 * Message for unexpected throws in portal layout gates — use only for logging.
 * UI must use a generic fallback, not this helper's return value.
 */
export function portalLayoutCaughtErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

/** Stable copy for vendor portal load failures shown to users. */
export const VENDOR_PORTAL_LOAD_ERROR_FALLBACK = 'Unable to load vendor profile.';
