import { NewsCategories } from '@/components/section/news/NewsCategories';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { newsCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import type { NewsSectionProps } from './shared';

export async function NewsCategoriesSection({ fetchOptions }: NewsSectionProps) {
  let categoryOptions: CategoryNavItem[] | null = null;
  let loadError: string | null = null;

  try {
    categoryOptions = await fetchPublicCategoryNav(
      'news',
      'All Stories',
      newsCategoryNavFallback,
      fetchOptions
    );
  } catch {
    loadError = 'Unable to load story categories.';
  }

  if (loadError || !categoryOptions) {
    return (
      <SectionLoadError
        title="Categories unavailable"
        message={loadError ?? 'Unable to load story categories.'}
      />
    );
  }

  return <NewsCategories categoryOptions={categoryOptions} />;
}
