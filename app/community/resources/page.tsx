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
import { RESOURCES_ITEMS } from '@/lib/constants/community/resources';

export const metadata: Metadata = {
  title: 'Resources - Free Downloads & More',
  description:
    'Download free e-books, sermon templates, beats, wallpapers, and explore affiliate products. Access resources to support your faith journey.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate resources data from central constants
async function generateResourcesData(): Promise<ResourceData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter and transform ebooks
  const ebooks: Ebook[] = RESOURCES_ITEMS.filter(item => item.type === 'ebook').map(item => ({
    title: item.title,
    description: item.description,
    downloads: item.downloads,
    cover: item.cover || '/placeholder.svg',
  }));

  // Filter and transform templates
  const templates: Template[] = RESOURCES_ITEMS.filter(item => item.type === 'template').map(
    item => ({
      title: item.title,
      description: item.description,
      downloads: item.downloads,
      type: item.templateType || '',
    })
  );

  // Filter and transform beats
  const beats: Beat[] = RESOURCES_ITEMS.filter(item => item.type === 'beat').map(item => ({
    title: item.title,
    description: item.description,
    downloads: item.downloads,
    genre: item.genre || '',
  }));

  // Filter and transform wallpapers
  const wallpapers: Wallpaper[] = RESOURCES_ITEMS.filter(item => item.type === 'wallpaper').map(
    item => ({
      title: item.title,
      description: item.description,
      downloads: item.downloads,
      category: item.category || '',
    })
  );

  // Filter and transform affiliate products
  const affiliateProducts: AffiliateProduct[] = RESOURCES_ITEMS.filter(
    item => item.type === 'affiliate'
  ).map(item => ({
    title: item.title,
    description: item.description,
    category: item.productCategory || '',
    price: item.price || '',
  }));

  return {
    ebooks,
    templates,
    beats,
    wallpapers,
    affiliateProducts,
  };
}

export default async function ResourcesPage() {
  const resourcesData = await generateResourcesData();

  return (
    <MainLayout>
      <ResourcesHero />
      <Suspense fallback={<ResourcesPageSkeleton />}>
        <ResourcesPageClient {...resourcesData} />
      </Suspense>
    </MainLayout>
  );
}
