'use client';

import { useRouter } from 'next/navigation';
import { FreeEbooks } from './FreeEbooks';
import { FreeBeats } from './FreeBeats';
import { ChristianWallpapers } from './ChristianWallpapers';
import { AffiliateProducts } from './AffiliateProducts';
import { FreeDownloads } from './FreeDownloads';
import type { ResourceDownloadCategory } from '@/lib/types/promotion';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { FolderOpen } from 'lucide-react';

export interface Ebook {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  cover: string;
  fileUrl?: string;
}

export interface Template {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  type: string;
}

export interface Beat {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  genre: string;
  fileUrl?: string;
}

export interface Wallpaper {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  category: string;
  fileUrl?: string;
}

export interface AffiliateProduct {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: string;
}

export interface ResourceData {
  ebooks: Ebook[];
  templates: Template[];
  beats: Beat[];
  wallpapers: Wallpaper[];
  affiliateProducts: AffiliateProduct[];
  downloadCategories: ResourceDownloadCategory[];
  initialErrorMessage?: string | null;
}

export const ResourcesPageClient = ({
  ebooks,
  // templates,
  beats,
  wallpapers,
  affiliateProducts,
  downloadCategories,
  initialErrorMessage = null,
}: ResourceData) => {
  const router = useRouter();
  const hasAnyContent =
    ebooks.length > 0 || beats.length > 0 || wallpapers.length > 0 || affiliateProducts.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load resources"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<FolderOpen className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <FreeDownloads downloadCategories={downloadCategories} />
      <FreeEbooks ebooks={ebooks} />
      <FreeBeats beats={beats} />
      <ChristianWallpapers wallpapers={wallpapers} />
      <AffiliateProducts products={affiliateProducts} />
    </>
  );
};
