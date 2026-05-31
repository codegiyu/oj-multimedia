import type { ReactNode } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import type { IPastorMeRes } from '@/lib/constants/endpoints';
import { PastorPortalLayoutClient } from './PastorPortalLayoutClient';
import { PastorPortalRouteGate } from '@/components/section/account/pastor-portal/PastorPortalRouteGate';

export default async function PastorPortalLayout({ children }: { children: ReactNode }) {
  const meRes = await callServerApi('PASTOR_GET_ME', {});

  const loadError =
    meRes.type === 'error' ? (meRes.message ?? 'Unable to load pastor portal.') : null;

  const data = meRes.type === 'success' ? (meRes.data as IPastorMeRes | undefined) : undefined;

  return (
    <PastorPortalLayoutClient>
      <PastorPortalRouteGate
        initialPortalState={data?.portalState ?? 'none'}
        initialApplication={data?.application ?? null}
        initialLoadError={loadError}>
        {children}
      </PastorPortalRouteGate>
    </PastorPortalLayoutClient>
  );
}
