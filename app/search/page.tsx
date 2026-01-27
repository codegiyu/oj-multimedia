import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchPageClient } from '@/components/section/public/search/SearchPageClient';
import { SearchResultsClient } from '@/components/section/public/search/SearchResultsClient';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';
import type { SearchResultItem } from '@/components/section/public/search/SearchResults';
import { MUSIC_ITEMS } from '@/lib/constants/music';
import { NEWS_ITEMS } from '@/lib/constants/news';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';
import { DEVOTIONALS_ITEMS } from '@/lib/constants/community/devotionals';
import { SERMONS_ITEMS } from '@/lib/constants/community/sermons';
import { TESTIMONIES_ITEMS } from '@/lib/constants/community/testimonies';
import { PRAYER_REQUESTS_ITEMS } from '@/lib/constants/community/prayer-requests';
import { QUESTIONS_ITEMS } from '@/lib/constants/community/questions';
import { POLLS_ITEMS } from '@/lib/constants/community/polls';
import { RESOURCES_ITEMS } from '@/lib/constants/community/resources';

export const metadata = {
  title: 'Search - Find Music, News, Videos & Community Content',
  description:
    'Search through music, news articles, videos, devotionals, sermons, testimonies, prayer requests, questions, polls, and resources. Find exactly what you are looking for on OJ Multimedia.',
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

  const devotionalItems: SearchResultItem[] = DEVOTIONALS_ITEMS.map(item => ({
    id: `d${item.id}`,
    title: item.title,
    subtitle: item.category,
    type: 'devotional' as const,
    image: undefined,
    meta: item.readingTime || item.date || '',
  }));

  const sermonItems: SearchResultItem[] = SERMONS_ITEMS.map(item => ({
    id: `s${item.id}`,
    title: item.title,
    subtitle: item.pastor,
    type: 'sermon' as const,
    image: item.thumbnail || item.image,
    meta: item.duration,
  }));

  const testimonyItems: SearchResultItem[] = TESTIMONIES_ITEMS.map(item => ({
    id: `t${item.id}`,
    title: item.title || item.content.substring(0, 50),
    subtitle: item.author,
    type: 'testimony' as const,
    image: item.avatar,
    meta: item.category || '',
  }));

  const prayerRequestItems: SearchResultItem[] = PRAYER_REQUESTS_ITEMS.map(item => ({
    id: `pr${item.id}`,
    title: item.title,
    subtitle: item.author,
    type: 'prayer-request' as const,
    image: undefined,
    meta: item.category,
  }));

  const questionItems: SearchResultItem[] = QUESTIONS_ITEMS.map(item => ({
    id: `q${item.id}`,
    title: item.question,
    subtitle: item.author,
    type: 'question' as const,
    image: undefined,
    meta: item.category,
  }));

  const pollItems: SearchResultItem[] = POLLS_ITEMS.map(item => ({
    id: `p${item.id}`,
    title: item.question,
    subtitle: item.category || '',
    type: 'poll' as const,
    image: undefined,
    meta: `${item.totalVotes} votes`,
  }));

  const resourceItems: SearchResultItem[] = RESOURCES_ITEMS.map(item => ({
    id: `r${item.id}`,
    title: item.title,
    subtitle: item.category || item.genre || item.templateType || item.productCategory || '',
    type: 'resource' as const,
    image: item.cover || item.image,
    meta: item.downloads,
  }));

  const allContent = [
    ...musicItems,
    ...newsItems,
    ...videoItems,
    ...devotionalItems,
    ...sermonItems,
    ...testimonyItems,
    ...prayerRequestItems,
    ...questionItems,
    ...pollItems,
    ...resourceItems,
  ];

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
