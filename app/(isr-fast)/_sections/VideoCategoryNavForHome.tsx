import { HomeVideoCategoryNav } from '@/components/section/home/HomeVideoCategoryNav';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { getVideoCategoryNavForHome } from './shared';

export async function VideoCategoryNavForHome() {
  let categoryOptions: CategoryNavItem[] | null = null;
  let loadError: string | null = null;

  try {
    categoryOptions = await getVideoCategoryNavForHome();
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Failed to load video categories';
  }

  if (loadError || !categoryOptions) {
    return (
      <SectionLoadError
        title="Video categories unavailable"
        message={loadError ?? 'Failed to load video categories'}
      />
    );
  }

  return <HomeVideoCategoryNav categoryOptions={categoryOptions} />;
}
