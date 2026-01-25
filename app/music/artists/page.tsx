import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { FeaturedArtistsPageClient } from '@/components/section/music/FeaturedArtistsPageClient';
import { MusicPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import { filterByCategory } from '@/lib/utils/music';
import type { FeaturedArtist } from '@/components/section/music/FeaturedArtists';
import { MUSIC_ITEMS } from '@/lib/constants/music';

export const metadata: Metadata = {
  title: 'Featured Artists - Music Creators',
  description:
    'Discover featured artists and creators. Explore profiles, follow your favorites, and discover new music from talented artists.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate featured artists data from central constants
async function generateFeaturedArtistsData(): Promise<{
  featuredArtists: (FeaturedArtist & { category: string })[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const featuredArtists: (FeaturedArtist & { category: string })[] = MUSIC_ITEMS.filter(
    item =>
      item.isFeaturedArtist &&
      item.name !== undefined &&
      item.followers !== undefined &&
      item.songs !== undefined
  ).map(item => ({
    id: item.id,
    name: item.name || item.artist,
    genre: item.genre || '',
    image: item.image || item.cover,
    followers: item.followers!,
    verified: item.verified || false,
    songs: item.songs!,
    category: item.category, // category is required in MusicItem, so this is always a string
  }));

  return {
    featuredArtists,
  };
}

interface FeaturedArtistsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FeaturedArtistsPage({ searchParams }: FeaturedArtistsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateFeaturedArtistsData();

  // Filter data server-side based on category
  const filteredData = {
    featuredArtists: filterByCategory(data.featuredArtists, category) as (FeaturedArtist & {
      category: string;
    })[],
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Featured Artists"
        titleHighlight="Featured"
        description="Discover featured artists and creators. Explore profiles, follow your favorites, and discover new music from talented artists."
        badgeText="Creators"
        badgeIcon="Users"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[{ icon: 'Users', text: 'Top creators' }, { text: 'Multiple genres' }]}
      />
      <Suspense fallback={<MusicPageSkeleton />}>
        <FeaturedArtistsPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
