import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { MusicAlbumsGridSkeleton } from '@/components/section/music/skeletons';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllAlbumsSection } from '../_sections/AllAlbumsSection';

export const metadata: Metadata = {
  title: 'All Albums - Full Releases',
  description:
    'Search and sort every published album on OJ Multimedia — complete collections from gospel artists and creators.',
};

interface AllAlbumsPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllAlbumsPage({ searchParams }: AllAlbumsPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Albums"
        titleHighlight="All"
        description="Search and browse every published album — sort by popularity or date and discover complete collections."
        badgeText="Collections"
        badgeIcon="DiscAlbum"
        backUrl="/music"
        backLabel="Back to Music"
        stats={[{ text: 'Full catalog' }, { text: 'Search & sort' }]}
      />
      <Suspense fallback={<MusicAlbumsGridSkeleton />} key={suspenseKey}>
        <AllAlbumsSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
