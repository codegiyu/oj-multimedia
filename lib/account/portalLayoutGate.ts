/** Prefetch/deferred auth responses should not surface as portal load errors. */
export function isDeferredPortalAuthResponse(responseCode: number | undefined): boolean {
  return responseCode === 204;
}

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

  return message ?? fallback;
}
