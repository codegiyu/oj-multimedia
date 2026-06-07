import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';
import { PastorPortalSettingsPageSkeleton } from '@/components/section/account/skeletons';
import { PastorPortalSettingsPageClient } from '@/components/section/account/pastor-portal/PastorPortalSettingsPageClient';
import type { ClientPastorProfile } from '@/lib/constants/endpoints';

async function PastorSettingsServer() {
  const res = await callServerApi('PASTOR_GET_ME', {});

  const initialPastor =
    res.type === 'success' ? (res.data.pastor as ClientPastorProfile | null) : null;

  return (
    <PastorPortalSettingsPageClient
      initialPastor={initialPastor}
      initialLoadError={res.type === 'error' ? (res.message ?? null) : null}
      portalStatus={res.type === 'success' ? res.data.portalStatus : undefined}
    />
  );
}

export default function PastorPortalSettingsPage() {
  return (
    <Suspense fallback={<PastorPortalSettingsPageSkeleton />}>
      <PastorSettingsServer />
    </Suspense>
  );
}
