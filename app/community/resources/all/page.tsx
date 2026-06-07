import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { ResourcesPageSkeleton } from '@/components/section/community/resources/ResourcesPageSkeleton';
import { buildAllBrowseSuspenseKey, type AllBrowseSearchParams } from '@/lib/utils/allBrowseQuery';
import { AllResourcesSection } from './_sections/AllResourcesSection';

export const metadata: Metadata = {
  title: 'All Resources - Free Downloads',
  description:
    'Search and browse every free resource — e-books, templates, beats, wallpapers, and affiliate products.',
};

interface AllResourcesPageProps {
  searchParams: Promise<AllBrowseSearchParams>;
}

export default async function AllResourcesPage({ searchParams }: AllResourcesPageProps) {
  const params = await searchParams;
  const suspenseKey = buildAllBrowseSuspenseKey(params);

  return (
    <MainLayout>
      <SubPageHero
        title="All Resources"
        titleHighlight="All"
        description="Search and browse every published resource — filter by type, sort by popularity, and download what you need."
        badgeText="Full Library"
        badgeIcon="BookOpen"
        backUrl="/community/resources"
        backLabel="Back to Resources"
        stats={[{ icon: 'BookOpen', text: 'Every type' }, { text: 'Search & filter' }]}
      />
      <Suspense fallback={<ResourcesPageSkeleton />} key={suspenseKey}>
        <AllResourcesSection searchParams={params} />
      </Suspense>
    </MainLayout>
  );
}
