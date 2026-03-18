import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchPageClient } from '@/components/section/public/search/SearchPageClient';
import { SearchFormSkeleton } from '@/components/section/public/search/SearchFormSkeleton';
import { SearchResultsClient } from '@/components/section/public/search/SearchResultsClient';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';
import type { ISearchResultItem } from '@/lib/constants/endpoints';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata = {
  title: 'Search - Find Music, News, Videos & Community Content',
  description:
    'Search through music, news articles, videos, devotionals, sermons, testimonies, prayer requests, questions, polls, and resources. Find exactly what you are looking for on OJ Multimedia.',
};

export const dynamic = 'force-dynamic';

type SearchPageProps = {
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

  const searchParams = new URLSearchParams();
  searchParams.set('q', q);
  if (params.type) searchParams.set('type', params.type);
  if (params.page) searchParams.set('page', params.page);
  if (params.limit) searchParams.set('limit', params.limit);

  const res = await callServerApi('PUBLIC_SEARCH', {
    query: `?${searchParams.toString()}` as `?${string}`,
  });

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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { results, error } = await fetchSearchResults(params);

  return (
    <MainLayout>
      <Suspense fallback={<SearchFormSkeleton />}>
        <SearchPageClient />
      </Suspense>
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResultsClient results={results} errorMessage={error} />
      </Suspense>
    </MainLayout>
  );
}
