import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ResourcesHero } from '@/components/section/community/resources/ResourcesHero';
import {
  ResourcesPageClient,
  type ResourceData,
  type Ebook,
  type Template,
  type Beat,
  type Wallpaper,
  type AffiliateProduct,
} from '@/components/section/community/resources/ResourcesPageClient';
import { ResourcesPageSkeleton } from '@/components/section/community/resources/ResourcesPageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import { RESOURCE_TYPES } from '@/lib/types/community';
import {
  mapToEbook,
  mapToTemplate,
  mapToBeat,
  mapToWallpaper,
  mapToAffiliateProduct,
} from '@/lib/utils/communityApiMappers';

export const metadata: Metadata = {
  title: 'Resources - Free Downloads & More',
  description:
    'Download free e-books, sermon templates, beats, wallpapers, and explore affiliate products. Access resources to support your faith journey.',
};

export const dynamic = 'force-dynamic';

const RESOURCE_TYPE_ORDER: (typeof RESOURCE_TYPES)[number][] = [
  'ebook',
  'template',
  'beat',
  'wallpaper',
  'affiliate',
];

async function fetchResourcesData(): Promise<
  ResourceData & { initialErrorMessage: string | null }
> {
  const baseQuery = '?limit=50&page=1';
  const requests = RESOURCE_TYPE_ORDER.map(type =>
    callServerApi('PUBLIC_GET_RESOURCES', {
      query: `${baseQuery}&type=${type}` as `?${string}`,
    })
  );
  const results = await Promise.all(requests);
  let initialErrorMessage: string | null = null;
  const [ebookRes, templateRes, beatRes, wallpaperRes, affiliateRes] = results;

  if (ebookRes.type === 'error')
    initialErrorMessage = ebookRes.error?.message ?? 'Failed to load resources';

  function mapResourceList<T>(
    res: (typeof results)[number],
    mapper: (i: Record<string, unknown>) => T
  ): T[] {
    if (res.type === 'error') return [];
    const list = (res.data?.resources ?? []) as unknown[];
    return list.map(i => mapper(i as Record<string, unknown>));
  }

  return {
    ebooks: mapResourceList(ebookRes, mapToEbook) as Ebook[],
    templates: mapResourceList(templateRes, mapToTemplate) as Template[],
    beats: mapResourceList(beatRes, mapToBeat) as Beat[],
    wallpapers: mapResourceList(wallpaperRes, mapToWallpaper) as Wallpaper[],
    affiliateProducts: mapResourceList(affiliateRes, mapToAffiliateProduct) as AffiliateProduct[],
    initialErrorMessage,
  };
}

export default async function ResourcesPage() {
  const resourcesData = await fetchResourcesData();

  return (
    <MainLayout>
      <ResourcesHero />
      <Suspense fallback={<ResourcesPageSkeleton />}>
        <ResourcesPageClient {...resourcesData} />
      </Suspense>
    </MainLayout>
  );
}
