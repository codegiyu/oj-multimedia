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

  return undefined;
}
