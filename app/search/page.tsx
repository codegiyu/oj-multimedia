import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchPageClient } from '@/components/section/public/search/SearchPageClient';
import { SearchResultsClient } from '@/components/section/public/search/SearchResultsClient';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';
import type { SearchResultItem } from '@/components/section/public/search/SearchResults';
import { MUSIC_ITEMS } from '@/lib/constants/music';
import { NEWS_ITEMS } from '@/lib/constants/news';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';

export const metadata = {
  title: 'Search - Find Music, News, Videos & Community Content',
  description:
    'Search through music, news articles, videos, and community content. Find exactly what you are looking for on OJ Multimedia.',
};

// Server-side filtering over lib/constants (music, news, videos)
async function filterContent(query: string): Promise<SearchResultItem[]> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  const musicItems: SearchResultItem[] = MUSIC_ITEMS.map(item => ({
    id: `m${item.id}`,
    title: item.title,
    subtitle: item.artist,
    type: 'music' as const,
    image: item.cover,
    meta: item.plays ?? item.duration ?? '',
  }));

  const newsItems: SearchResultItem[] = NEWS_ITEMS.map(item => ({
    id: `n${item.id}`,
    title: item.title,
    subtitle: item.category,
    type: 'news' as const,
    image: item.image,
    meta: item.readTime,
  }));

  const videoItems: SearchResultItem[] = VIDEOS_ITEMS.map(item => ({
    id: `v${item.id}`,
    title: item.title,
    subtitle: item.creator,
    type: 'video' as const,
    image: item.thumbnail,
    meta: item.duration ?? item.views ?? '',
  }));

  const allContent = [...musicItems, ...newsItems, ...videoItems];

  return allContent.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.subtitle.toLowerCase().includes(searchQuery)
  );
}

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const resultsPromise = filterContent(query);

  return (
    <MainLayout>
      <Suspense fallback={<></>}>
        <SearchPageClient />
      </Suspense>
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResultsWrapper resultsPromise={resultsPromise} />
      </Suspense>
    </MainLayout>
  );
}

// Wrapper component to handle async results
async function SearchResultsWrapper({
  resultsPromise,
}: {
  resultsPromise: Promise<SearchResultItem[]>;
}) {
  const results = await resultsPromise;
  return <SearchResultsClient results={results} />;
}
