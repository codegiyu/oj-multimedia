export function buildMusicBaseQuery(category: string): string {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';

  return `?limit=12&page=1&status=published${categoryParam}`;
}
