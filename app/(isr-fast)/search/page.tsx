import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchPageClient } from '@/components/section/public/search/SearchPageClient';
import { SearchFormAreaSkeleton } from '@/components/section/public/search/SearchFormSkeleton';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';
import { SearchResultsSection } from './_sections/SearchResultsSection';

export const metadata = {
  title: 'Search - Find Music, News, Videos & Community Content',
  description:
    'Search through music, news articles, videos, devotionals, sermons, testimonies, prayer requests, questions, polls, and resources. Find exactly what you are looking for on OJ Multimedia.',
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string; page?: string; limit?: string }>;
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <MainLayout>
      <Suspense fallback={<SearchFormAreaSkeleton />}>
        <SearchPageClient />
      </Suspense>
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResultsSection searchParams={searchParams} />
      </Suspense>
    </MainLayout>
  );
}
