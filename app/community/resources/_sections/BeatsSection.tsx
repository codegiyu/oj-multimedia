import { FreeBeats } from '@/components/section/community/resources/FreeBeats';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToBeat } from '@/lib/utils/communityApiMappers';
import { filterCompleteResources } from '@/lib/utils/contentCompleteness';
import type { Beat } from '@/components/section/community/resources/ResourcesPageClient';
import { RESOURCES_BASE_QUERY } from './shared';

export async function BeatsSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_RESOURCES',
    {
      query: `${RESOURCES_BASE_QUERY}&type=beat` as `?${string}`,
    },
    ISR_PUBLIC_FETCH.slow
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Beats unavailable"
        message={res.error?.message ?? 'Failed to load beats'}
      />
    );
  }

  const list = (res.data?.resources ?? []) as unknown as Record<string, unknown>[];
  const beats = filterCompleteResources(list).map(i =>
    mapToBeat(i as Record<string, unknown>)
  ) as Beat[];

  return <FreeBeats beats={beats} />;
}
