import { CommunityHighlightsPanel } from '@/components/section/home/CommunityHighlightsPanel';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { ICommunityHighlightsRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR } from './shared';

export async function CommunityHighlightsSection() {
  const res = await callPublicServerApi('PUBLIC_GET_COMMUNITY_HIGHLIGHTS', {}, HOME_ISR);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Community highlights unavailable"
        message={res.error?.message ?? 'Failed to load community highlights'}
      />
    );
  }

  const highlights = (res.data as ICommunityHighlightsRes | undefined)?.highlights ?? [];

  return <CommunityHighlightsPanel highlights={highlights} />;
}
