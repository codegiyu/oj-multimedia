import { FreeDownloads } from '@/components/section/community/resources/FreeDownloads';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { DOWNLOAD_CATEGORIES_FALLBACK } from '@/lib/constants/promotionFallbacks';
import type { ResourceDownloadCategory } from '@/lib/types/promotion';

export async function ResourceDownloadCategoriesSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_RESOURCE_DOWNLOAD_CATEGORIES',
    {},
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Download categories unavailable"
        message={res.error?.message ?? 'Failed to load download categories'}
      />
    );
  }

  const downloadCategories: ResourceDownloadCategory[] = res.data?.downloadCategories?.length
    ? res.data.downloadCategories
    : DOWNLOAD_CATEGORIES_FALLBACK;

  return <FreeDownloads downloadCategories={downloadCategories} />;
}
