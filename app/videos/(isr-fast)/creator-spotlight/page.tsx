import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';
import { ArtistsSpotlightGridSection } from '@/app/music/_sections/ArtistsSpotlightGridSection';
import { ArtistsSpotlightGridSkeleton } from '@/components/section/music/skeletons';

export const metadata: Metadata = {
  title: 'Creator Spotlight - Featured Video Creators',
  description: 'Discover video creators in the spotlight on OJ Multimedia.',
};

interface CreatorSpotlightPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CreatorSpotlightPage({ searchParams }: CreatorSpotlightPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);
  const fetchOptions = ISR_PUBLIC_FETCH.fast;

  return (
    <MainLayout>
      <SubPageHero
        title="Creator Spotlight"
        titleHighlight="Spotlight"
        description="Active and trending video creators featured on OJ Multimedia."
        badgeText="Creators"
        badgeIcon="Users"
        backUrl="/videos"
        backLabel="Back to Videos"
        stats={[{ icon: 'Users', text: 'Video creators' }, { text: 'Editorially curated' }]}
      />
      <Suspense fallback={<ArtistsSpotlightGridSkeleton />} key={String(page)}>
        <ArtistsSpotlightGridSection
          scope="spotlight"
          page={page}
          variant="subpage"
          fetchOptions={fetchOptions}
        />
      </Suspense>
    </MainLayout>
  );
}
