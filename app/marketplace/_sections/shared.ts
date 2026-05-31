export const MARKETPLACE_LANDING_PAGE_SIZE = 8;
export const MARKETPLACE_PRODUCTS_DEFAULT_LIMIT = 24;

export type MarketplaceProductsQueryParams = {
  category?: string;
  subCategory?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

export type MarketplaceSearchQueryParams = {
  q?: string;
  category?: string;
  vendor?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

export function buildMarketplaceProductsQuery(
  params: MarketplaceProductsQueryParams,
  defaultLimit = MARKETPLACE_PRODUCTS_DEFAULT_LIMIT
): string {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(params.limit ?? String(defaultLimit), 10) || defaultLimit)
  );
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (params.category) query.set('category', params.category);
  if (params.subCategory) query.set('subCategory', params.subCategory);
  if (params.sort) query.set('sort', params.sort);
  query.set('status', 'published');

  return query.toString();
}

export function buildMarketplaceSearchQuery(
  params: MarketplaceSearchQueryParams,
  defaultLimit = MARKETPLACE_PRODUCTS_DEFAULT_LIMIT
): string {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const limit = Math.min(50, parseInt(params.limit ?? String(defaultLimit), 10) || defaultLimit);
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  query.set('status', 'published');
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.category) query.set('category', params.category);
  if (params.vendor) query.set('vendor', params.vendor);
  if (params.sort) query.set('sort', params.sort);

  return query.toString();
}
