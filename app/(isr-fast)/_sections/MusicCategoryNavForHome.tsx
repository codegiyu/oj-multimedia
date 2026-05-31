import { HomeMusicCategoryNav } from '@/components/section/home/HomeMusicCategoryNav';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { getMusicCategoryNavForHome } from './shared';

export async function MusicCategoryNavForHome() {
  let categoryOptions: CategoryNavItem[] | null = null;
  let loadError: string | null = null;

  try {
    categoryOptions = await getMusicCategoryNavForHome();
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Failed to load music categories';
  }

  if (loadError || !categoryOptions) {
    return (
      <SectionLoadError
        title="Music categories unavailable"
        message={loadError ?? 'Failed to load music categories'}
      />
    );
  }

  return <HomeMusicCategoryNav categoryOptions={categoryOptions} />;
}
