import type { PublicServerApiConfig } from '@/lib/services/serverApi';

export type NewsSectionProps = {
  category: string;
  limit?: number;
  fetchOptions?: PublicServerApiConfig;
};

export function buildNewsBaseQuery(category: string, limit = 15): `?${string}` {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';

  return `?limit=${limit}&page=1&status=published${categoryParam}` as `?${string}`;
}
