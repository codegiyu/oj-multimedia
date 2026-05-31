import { MusicCategories } from '@/components/section/music/MusicCategories';
import { musicCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import type { PublicServerApiConfig } from '@/lib/services/serverApi';

interface MusicCategoriesSectionProps {
  isr?: PublicServerApiConfig;
}

export async function MusicCategoriesSection({ isr }: MusicCategoriesSectionProps) {
  const categoryOptions = await fetchPublicCategoryNav(
    'music',
    'All Genres',
    musicCategoryNavFallback,
    isr
  );

  return <MusicCategories categoryOptions={categoryOptions} />;
}
