/** Match pathname to href without treating `home-adverts` as under `home`. */
export function isPathActive(pathname: string, href: string, exact = false): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const normalizedHref = href.replace(/\/$/, '') || '/';

  if (normalizedHref === '/') return normalized === '/';
  if (exact) return normalized === normalizedHref;

  return normalized === normalizedHref || normalized.startsWith(`${normalizedHref}/`);
}
