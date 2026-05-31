import type { PublicServerApiConfig } from '@/lib/services/serverApi';

export type VideoSectionProps = {
  category: string;
  limit?: number;
  fetchOptions?: PublicServerApiConfig;
};

export function buildVideoBaseQuery(category: string, limit = 12): `?${string}` {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';

  return `?limit=${limit}&page=1&status=published${categoryParam}` as `?${string}`;
}
