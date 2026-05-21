export function buildUpstreamUrl(baseUrl: string, path: string, query = ''): string {
  const normalizedBase = baseUrl.replace(/\/$/, '');

  return `${normalizedBase}${path}${query}`;
}
