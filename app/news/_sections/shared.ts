import type { PublicServerApiConfig } from '@/lib/services/serverApi';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { IPublicNewsListRes, PublicNewsListItem } from '@/lib/constants/endpoints/types';
import { buildNewsBrowseQuery } from '@/lib/utils/newsBrowse';
import type { Pagination } from '@/lib/types/pagination';

export type NewsSectionProps = {
  category: string;
  limit?: number;
  page?: number;
  fetchOptions?: PublicServerApiConfig;
};

export function buildNewsBaseQuery(category: string, limit = 15): `?${string}` {
  return buildNewsBrowseQuery(category, 1, { limit }) as `?${string}`;
}

export type FetchPublicNewsResult = {
  articles: PublicNewsListItem[];
  pagination: Pagination | null;
  error: string | null;
};

export async function fetchPublicNewsArticles(options: {
  category: string;
  page?: number;
  limit?: number;
  type?: string;
  fetchOptions?: PublicServerApiConfig;
}): Promise<FetchPublicNewsResult> {
  const page = options.page ?? 1;
  const query = buildNewsBrowseQuery(options.category, page, {
    limit: options.limit,
    type: options.type,
  });
  const res = await callPublicServerApi('PUBLIC_GET_NEWS', { query }, options.fetchOptions);

  if (res.type === 'error') {
    return {
      articles: [],
      pagination: null,
      error: res.error?.message ?? 'Failed to load news',
    };
  }

  const data = res.data as IPublicNewsListRes | undefined;
  const articles = data?.articles ?? [];

  return {
    articles,
    pagination: data?.pagination ?? null,
    error: null,
  };
}
