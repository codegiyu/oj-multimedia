import { ChristianLivingTipsSection } from '@/components/section/community/devotionals/ChristianLivingTipsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToLivingTip } from '@/lib/utils/communityApiMappers';
import type { LivingTip } from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DEVOTIONALS_BASE_QUERY } from '../../_sections/shared';

export async function LivingTipsSection() {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: `${DEVOTIONALS_BASE_QUERY}&type=living-tips` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Living tips unavailable"
        message={res.error?.message ?? 'Failed to load living tips'}
      />
    );
  }

  const livingTips = ((res.data?.devotionals ?? []) as unknown[]).map(i =>
    mapToLivingTip(i as Record<string, unknown>)
  ) as LivingTip[];

  return <ChristianLivingTipsSection tips={livingTips} />;
}
