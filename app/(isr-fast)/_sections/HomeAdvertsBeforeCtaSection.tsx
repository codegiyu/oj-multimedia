import { HomeAdvertStrip } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicHomeAdvertsRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR } from './shared';

export async function HomeAdvertsBeforeCtaSection() {
  const res = await callPublicServerApi('PUBLIC_GET_HOME_ADVERTS', {}, HOME_ISR);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Advertisement unavailable"
        message={res.error?.message ?? 'Failed to load home advertisements'}
      />
    );
  }

  const adverts =
    (res.data as IPublicHomeAdvertsRes | undefined)?.adverts.filter(a => a.slot === 'before_cta') ??
    [];

  return <HomeAdvertStrip adverts={adverts} />;
}
