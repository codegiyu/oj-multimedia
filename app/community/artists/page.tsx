import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { Skeleton } from '@/components/ui/skeleton';
import { ArtistsListSection } from './_sections/ArtistsListSection';

export const metadata: Metadata = {
  title: 'Artists - Community Creators',
  description:
    'Discover artists and creators. Explore profiles, music, and videos from talented creators in our community.',
};

interface ArtistsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CommunityArtistsPage({ searchParams }: ArtistsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? '1'), 10) || 1);

  return (
    <MainLayout>
      <SubPageHero
        title="Artists"
        titleHighlight="Artists"
        description="Discover artists and creators. Explore profiles, music, and videos from talented creators in our community."
        badgeText="Community"
        badgeIcon="Users"
        backUrl="/community"
        backLabel="Back to Community"
        stats={[{ icon: 'Users', text: 'Creators' }, { text: 'Music & Videos' }]}
      />
      <Suspense
        fallback={
          <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
          </div>
        }
        key={page}>
        <ArtistsListSection page={page} />
      </Suspense>
    </MainLayout>
  );
}
