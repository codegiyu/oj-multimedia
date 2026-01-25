'use client';

import { FreeEbooks } from './FreeEbooks';
import { SermonTemplates } from './SermonTemplates';
import { FreeBeats } from './FreeBeats';
import { ChristianWallpapers } from './ChristianWallpapers';
import { AffiliateProducts } from './AffiliateProducts';
import { FreeDownloads } from './FreeDownloads';

export interface Ebook {
  title: string;
  description: string;
  downloads: string;
  cover: string;
}

export interface Template {
  title: string;
  description: string;
  downloads: string;
  type: string;
}

export interface Beat {
  title: string;
  description: string;
  downloads: string;
  genre: string;
}

export interface Wallpaper {
  title: string;
  description: string;
  downloads: string;
  category: string;
}

export interface AffiliateProduct {
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
}

export const ResourcesPageClient = ({
  ebooks,
  templates,
  beats,
  wallpapers,
  affiliateProducts,
}: ResourceData) => {
  return (
    <>
      <FreeDownloads />
      <FreeEbooks ebooks={ebooks} />
      <SermonTemplates templates={templates} />
      <FreeBeats beats={beats} />
      <ChristianWallpapers wallpapers={wallpapers} />
      <AffiliateProducts products={affiliateProducts} />
    </>
  );
};
