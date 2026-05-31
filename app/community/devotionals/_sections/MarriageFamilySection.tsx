import { MarriageAndFamilySection } from '@/components/section/community/devotionals/MarriageAndFamilySection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToMarriageFamily } from '@/lib/utils/communityApiMappers';
import type { MarriageFamily } from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DEVOTIONALS_BASE_QUERY } from '../../_sections/shared';

export async function MarriageFamilySection() {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: `${DEVOTIONALS_BASE_QUERY}&type=marriage-family` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Marriage & family content unavailable"
        message={res.error?.message ?? 'Failed to load marriage & family content'}
      />
    );
  }

  const marriageFamily = ((res.data?.devotionals ?? []) as unknown[]).map(i =>
    mapToMarriageFamily(i as Record<string, unknown>)
  ) as MarriageFamily[];

  return <MarriageAndFamilySection content={marriageFamily} />;
}
