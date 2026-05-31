import { FreeEbooks } from '@/components/section/community/resources/FreeEbooks';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToEbook } from '@/lib/utils/communityApiMappers';
import { filterCompleteResources } from '@/lib/utils/contentCompleteness';
import type { Ebook } from '@/components/section/community/resources/ResourcesPageClient';
import { RESOURCES_BASE_QUERY } from './shared';

export async function EbooksSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_RESOURCES',
    {
      query: `${RESOURCES_BASE_QUERY}&type=ebook` as `?${string}`,
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="E-books unavailable"
        message={res.error?.message ?? 'Failed to load e-books'}
      />
    );
  }

  const list = (res.data?.resources ?? []) as unknown as Record<string, unknown>[];
  const ebooks = filterCompleteResources(list).map(i =>
    mapToEbook(i as Record<string, unknown>)
  ) as Ebook[];

  return <FreeEbooks ebooks={ebooks} />;
}
