import { SectionLoadError } from '@/components/general/SectionLoadError';
import { PastorPortalMePanel } from '@/components/section/account/pastor-portal/PastorPortalMePanel';
import { getPastorMe } from '@/lib/services/pastorPortalData';
import type { IPastorMeRes } from '@/lib/constants/endpoints';

export async function PastorPortalMeSection() {
  const meRes = await getPastorMe();

  if (meRes.type === 'error') {
    return (
      <SectionLoadError
        title="Profile unavailable"
        message={meRes.message || 'Unable to load pastor profile.'}
      />
    );
  }

  const pastor = (meRes.data as IPastorMeRes).pastor ?? null;

  return <PastorPortalMePanel pastor={pastor} />;
}
