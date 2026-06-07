import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { Skeleton } from '@/components/ui/skeleton';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllArtistsBrowseSection } from './_sections/AllArtistsBrowseSection';

export const metadata: Metadata = {
  title: 'All Artists - Community Creators',
  description:
    'Search and browse every community artist. Discover creators, music, and videos from talented artists.',
};

interface AllArtistsPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllArtistsPage({ searchParams }: AllArtistsPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Artists"
        titleHighlight="All"
        description="Search and browse every community artist — sort by popularity and discover creators across music and video."
        badgeText="Full Directory"
        badgeIcon="Users"
        backUrl="/community/artists"
        backLabel="Back to Artists"
        stats={[{ icon: 'Users', text: 'Every creator' }, { text: 'Search & filter' }]}
      />
      <Suspense
        fallback={
          <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        }
        key={suspenseKey}>
        <AllArtistsBrowseSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
