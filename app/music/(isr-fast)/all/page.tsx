import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { MusicTrendingGridSectionSkeleton } from '@/components/section/music/skeletons';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllMusicSection } from '../../_sections/AllMusicSection';

export const metadata: Metadata = {
  title: 'All Music - Browse Songs',
  description:
    'Search, filter, and sort every published song on OJ Multimedia — from gospel and worship to afrobeats and more.',
};

interface AllMusicPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllMusicPage({ searchParams }: AllMusicPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Music"
        titleHighlight="All"
        description="Search and browse every published song — filter by genre, sort by popularity, and discover your next favorite track."
        badgeText="Full Catalog"
        badgeIcon="Play"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[{ icon: 'Play', text: 'Every genre' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<MusicTrendingGridSectionSkeleton />} key={suspenseKey}>
        <AllMusicSection searchParams={params} fetchOptions={ISR_PUBLIC_FETCH.fast} />
      </Suspense>
    </MainLayout>
  );
}
