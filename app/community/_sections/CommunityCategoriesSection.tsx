import { CommunityCategoriesGrid } from '@/components/section/community/CommunityCategoriesGrid';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { DEFAULT_CATEGORY_COUNTS } from './shared';

export async function CommunityCategoriesSection() {
  const res = await callPublicServerApi('PUBLIC_GET_COMMUNITY', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Community categories unavailable"
        message={res.error?.message ?? 'Failed to load community categories'}
      />
    );
  }

  const categoryCounts = { ...DEFAULT_CATEGORY_COUNTS, ...res.data?.categoryCounts };

  return <CommunityCategoriesGrid categoryCounts={categoryCounts} />;
}
