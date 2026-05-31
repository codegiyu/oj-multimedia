import { VideoCategories } from '@/components/section/video/VideoCategories';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { videoCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import type { VideoSectionProps } from './shared';

export async function VideoCategoriesSection({ fetchOptions }: VideoSectionProps) {
  let categoryOptions: CategoryNavItem[] | null = null;
  let loadError: string | null = null;

  try {
    categoryOptions = await fetchPublicCategoryNav(
      'video',
      'All Videos',
      videoCategoryNavFallback,
      fetchOptions
    );
  } catch {
    loadError = 'Unable to load video categories.';
  }

  if (loadError || !categoryOptions) {
    return (
      <SectionLoadError
        title="Categories unavailable"
        message={loadError ?? 'Unable to load video categories.'}
      />
    );
  }

  return <VideoCategories categoryOptions={categoryOptions} />;
}
