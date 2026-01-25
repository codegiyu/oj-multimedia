import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SearchPageClient } from '@/components/section/public/search/SearchPageClient';
import { SearchResultsClient } from '@/components/section/public/search/SearchResultsClient';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';
import type { SearchResultItem } from '@/components/section/public/search/SearchResults';

export const metadata = {
  title: 'Search - Find Music, News, Videos & Community Content',
  description:
    'Search through music, news articles, videos, and community content. Find exactly what you are looking for on OJ Multimedia.',
};

// Comprehensive mock data - simulating database/API data
const allContent: SearchResultItem[] = [
  // Music
  {
    id: 'm1',
    title: 'Grace & Fire',
    subtitle: 'David Okonkwo',
    type: 'music',
    image: '/images/album-1.jpg',
    meta: '2.3M plays',
  },
  {
    id: 'm2',
    title: 'Elevation',
    subtitle: 'The Collective',
    type: 'music',
    image: '/images/album-2.jpg',
    meta: '1.8M plays',
  },
  {
    id: 'm3',
    title: 'New Dawn',
    subtitle: 'Amara Joy',
    type: 'music',
    image: '/images/album-3.jpg',
    meta: '956K plays',
  },
  {
    id: 'm4',
    title: 'Breakthrough',
    subtitle: 'Kingdom Sound',
    type: 'music',
    image: '/images/artist-1.jpg',
    meta: '1.2M plays',
  },
  {
    id: 'm5',
    title: 'Worship Medley',
    subtitle: 'Live Sessions',
    type: 'music',
    image: '/images/artist-2.jpg',
    meta: '890K plays',
  },
  {
    id: 'm6',
    title: 'Rise Up',
    subtitle: 'Gospel Choir',
    type: 'music',
    image: '/images/artist-3.jpg',
    meta: '2.1M plays',
  },

  // News
  {
    id: 'n1',
    title: '5 Morning Habits That Will Transform Your Day',
    subtitle: 'Lifestyle',
    type: 'news',
    image: '/images/album-1.jpg',
    meta: '4 min read',
  },
  {
    id: 'n2',
    title: 'New Music Friday: The Hottest Drops This Week',
    subtitle: 'Entertainment',
    type: 'news',
    image: '/images/album-2.jpg',
    meta: '3 min read',
  },
  {
    id: 'n3',
    title: 'Remote Jobs: Companies Hiring Worldwide in 2025',
    subtitle: 'Jobs & Careers',
    type: 'news',
    image: '/images/album-3.jpg',
    meta: '6 min read',
  },
  {
    id: 'n4',
    title: 'Finding Purpose: Stories of Young Changemakers',
    subtitle: 'Inspiration',
    type: 'news',
    image: '/images/artist-1.jpg',
    meta: '7 min read',
  },
  {
    id: 'n5',
    title: 'Tech Scholarships Open for African Students',
    subtitle: 'Scholarships',
    type: 'news',
    image: '/images/artist-2.jpg',
    meta: '4 min read',
  },
  {
    id: 'n6',
    title: "Movie Review: The Year's Most Talked About Film",
    subtitle: 'Movies & Reviews',
    type: 'news',
    image: '/images/artist-3.jpg',
    meta: '5 min read',
  },

  // Videos
  {
    id: 'v1',
    title: "Behind the Music: Making of 'Grace'",
    subtitle: 'Studio Sessions',
    type: 'video',
    image: '/images/video-thumb-1.jpg',
    meta: '12:34',
  },
  {
    id: 'v2',
    title: 'Live Performance Highlights',
    subtitle: 'OJ Media',
    type: 'video',
    image: '/images/video-thumb-2.jpg',
    meta: '8:45',
  },
  {
    id: 'v3',
    title: 'Artist Interview: Faith & Music',
    subtitle: 'The Collective',
    type: 'video',
    image: '/images/album-1.jpg',
    meta: '15:20',
  },
  {
    id: 'v4',
    title: 'Acoustic Session: Worship Favorites',
    subtitle: 'Live Sessions',
    type: 'video',
    image: '/images/album-2.jpg',
    meta: '22:10',
  },

  // Community
  {
    id: 'c1',
    title: 'Dealing with Anxiety in College',
    subtitle: 'Discussion',
    type: 'community',
    image: '/images/artist-1.jpg',
    meta: '128 replies',
  },
  {
    id: 'c2',
    title: 'My Testimony: From Doubt to Faith',
    subtitle: 'Testimony',
    type: 'community',
    image: '/images/artist-2.jpg',
    meta: '89 likes',
  },
  {
    id: 'c3',
    title: 'Daily Devotional: Finding Peace',
    subtitle: 'Devotional',
    type: 'community',
    image: '/images/artist-3.jpg',
    meta: '234 views',
  },
  {
    id: 'c4',
    title: 'Prayer Request: Family Healing',
    subtitle: 'Prayer',
    type: 'community',
    image: '/images/album-1.jpg',
    meta: '56 prayers',
  },
];

// Server-side filtering function - simulates database query
async function filterContent(query: string): Promise<SearchResultItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase();

  return allContent.filter(item => {
    return (
      item.title.toLowerCase().includes(searchQuery) ||
      item.subtitle.toLowerCase().includes(searchQuery)
    );
  });
}

type SearchPageProps = {
  searchParams: { q?: string };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
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
