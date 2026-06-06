import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { ArtistsSpotlightGridSection } from '../../_sections/ArtistsSpotlightGridSection';
import { ArtistsSpotlightGridSkeleton } from '@/components/section/music/skeletons';

export const metadata: Metadata = {
  title: 'Featured Artists - Creators You Should Know',
  description: 'Browse featured music artists and creators curated by the OJ Multimedia team.',
};

interface FeaturedArtistsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function FeaturedArtistsPage({ searchParams }: FeaturedArtistsPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

  return (
    <MainLayout>
      <SubPageHero
        title="Featured Artists"
        titleHighlight="Featured"
        description="Established creators and artists you should know — hand-picked for the music community."
        badgeText="Creators"
        badgeIcon="Users"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[{ icon: 'Users', text: 'Curated artists' }, { text: 'Updated regularly' }]}
      />
      <Suspense fallback={<ArtistsSpotlightGridSkeleton />} key={String(page)}>
        <ArtistsSpotlightGridSection
          scope="featured"
          page={page}
          variant="subpage"
          fetchOptions={fetchOptions}
        />
      </Suspense>
    </MainLayout>
  );
}
