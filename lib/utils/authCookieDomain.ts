export function resolveAuthCookieDomain(
  hostname: string,
  configuredDomain?: string
): string | undefined {
  const configured = configuredDomain?.trim();

  if (configured) {
    return configured;
  }

  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return undefined;
  }

  // In production, neither AUTH_COOKIE_DOMAIN nor NEXT_PUBLIC_COOKIE_DOMAIN is set.
  // Frontend auth cookies will be scoped to the exact hostname and will not work across
  // subdomains. Set one of these env vars to a shared parent domain (e.g. .ojmultimedia.com).
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[auth] AUTH_COOKIE_DOMAIN / NEXT_PUBLIC_COOKIE_DOMAIN not set in production — ' +
        'frontend auth cookies are scoped to hostname "' +
        hostname +
        '" only'
    );
  }

  return undefined;
}
