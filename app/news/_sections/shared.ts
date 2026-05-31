import type { PublicServerApiConfig } from '@/lib/services/serverApi';
import { buildNewsBrowseQuery } from '@/lib/utils/newsBrowse';

export type NewsSectionProps = {
  category: string;
  limit?: number;
  page?: number;
  fetchOptions?: PublicServerApiConfig;
};

export function buildNewsBaseQuery(category: string, limit = 15): `?${string}` {
  return buildNewsBrowseQuery(category, 1, { limit }) as `?${string}`;
}
