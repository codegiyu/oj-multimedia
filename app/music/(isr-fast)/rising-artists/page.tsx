import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { ArtistsSpotlightGridSection } from '../../_sections/ArtistsSpotlightGridSection';
import { ArtistsSpotlightGridSkeleton } from '@/components/section/music/skeletons';

export const metadata: Metadata = {
  title: 'Rising Artists - New Talents',
  description: 'Discover rising artists and new talents hand-picked by the OJ Multimedia team.',
};

interface RisingArtistsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function RisingArtistsPage({ searchParams }: RisingArtistsPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

  return (
    <MainLayout>
      <SubPageHero
        title="Rising Artists"
        titleHighlight="Rising"
        description="Emerging creators and new talents spotlighted on OJ Multimedia. Discover fresh voices before they hit the mainstream."
        badgeText="New Talents"
        badgeIcon="TrendingUp"
        backUrl="/"
        backLabel="Back to Home"
        stats={[{ icon: 'TrendingUp', text: 'Emerging creators' }, { text: 'Editorially curated' }]}
      />
      <Suspense fallback={<ArtistsSpotlightGridSkeleton />} key={String(page)}>
        <ArtistsSpotlightGridSection
          scope="rising"
          page={page}
          variant="subpage"
          fetchOptions={fetchOptions}
        />
      </Suspense>
    </MainLayout>
  );
}
