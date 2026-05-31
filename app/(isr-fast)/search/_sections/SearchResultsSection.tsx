import { SectionLoadError } from '@/components/general/SectionLoadError';
import { SearchResultsClient } from '@/components/section/public/search/SearchResultsClient';
import type { ISearchResultItem } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';

type SearchResultsSectionProps = {
  searchParams: Promise<{ q?: string; type?: string; page?: string; limit?: string }>;
};

async function fetchSearchResults(params: {
  q?: string;
  type?: string;
  page?: string;
  limit?: string;
}): Promise<{ results: ISearchResultItem[]; error: string | null }> {
  const q = params.q?.trim() ?? '';
  if (!q) {
    return { results: [], error: null };
  }

  const urlParams = new URLSearchParams();
  urlParams.set('q', q);
  if (params.type) urlParams.set('type', params.type);
  if (params.page) urlParams.set('page', params.page);
  if (params.limit) urlParams.set('limit', params.limit);

  const res = await callPublicServerApi(
    'PUBLIC_SEARCH',
    {
      query: `?${urlParams.toString()}` as `?${string}`,
    },
    ISR_PUBLIC_FETCH.fast
  );

  if (res.error) {
    return {
      results: [],
      error: res.error?.message ?? 'Failed to load search results.',
    };
  }

  const data = res.data;
  const results = data?.results ?? [];

  return { results, error: null };
}

export async function SearchResultsSection({ searchParams }: SearchResultsSectionProps) {
  const params = await searchParams;
  const { results, error } = await fetchSearchResults(params);

  if (error) {
    return <SectionLoadError title="Search results unavailable" message={error} />;
  }

  return <SearchResultsClient results={results} />;
}
