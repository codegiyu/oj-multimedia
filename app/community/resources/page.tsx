import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ResourcesHero } from '@/components/section/community/resources/ResourcesHero';
import { ResourcesBrowseSection } from './_sections/ResourcesBrowseSection';
import { ResourcesPageSkeleton } from '@/components/section/community/resources/ResourcesPageSkeleton';
import { parseBrowsePageParam } from '@/lib/utils/browsePage';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.slow` (3600s). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Resources - Free Downloads & More',
  description:
    'Download free e-books, sermon templates, beats, wallpapers, and explore affiliate products. Access resources to support your faith journey.',
};

interface ResourcesPageProps {
  searchParams: Promise<{ type?: string; page?: string }>;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const params = await searchParams;
  const page = parseBrowsePageParam(params.page);

  return (
    <MainLayout>
      <ResourcesHero />
      <Suspense fallback={<ResourcesPageSkeleton />} key={`${params.type ?? 'all'}|${page}`}>
        <ResourcesBrowseSection page={page} typeParam={params.type} />
      </Suspense>
    </MainLayout>
  );
}
