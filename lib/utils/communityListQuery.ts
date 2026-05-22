/** Builds query strings for public community list endpoints (App Router server pages). */
export function buildCommunityListQuery(params: {
  limit?: number;
  page?: number;
  type?: string;
  status?: string;
  category?: string;
  publishedOnly?: boolean;
}): `?${string}` {
  const q = new URLSearchParams();
  q.set('limit', String(params.limit ?? 50));
  q.set('page', String(params.page ?? 1));

  if (params.publishedOnly) {
    q.set('status', 'published');
  }

  if (params.type) {
    q.set('type', params.type);
  }

  if (params.status) {
    q.set('status', params.status);
  }

  if (params.category && params.category !== 'all') {
    q.set('category', params.category);
  }

  return `?${q.toString()}` as `?${string}`;
}
