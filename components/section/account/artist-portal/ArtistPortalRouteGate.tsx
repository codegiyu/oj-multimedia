'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardProfileRequiredPanel } from '@/components/section/account/shared/DashboardProfileRequiredPanel';
import { BecomeArtistModal } from '@/components/section/account/shared/BecomeArtistModal';
import { DashboardRoleAccountStatusPanel } from '@/components/section/account/shared/DashboardRoleAccountStatusPanel';
import type { IArtistMeRes } from '@/lib/constants/endpoints';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';

export interface ArtistPortalRouteGateProps {
  initialProfileMissing: boolean;
  initialLoadError: string | null;
  initialPortalStatus: RolePortalStatus;
  initialMeta: IRolePortalMeta;
  children: ReactNode;
}

export function artistPortalMetaFromMe(data: IArtistMeRes | undefined): {
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
} {
  const portalStatus = (data?.portalStatus ?? 'active') as RolePortalStatus;

  return {
    portalStatus,
    meta: {
      portalStatus,
      statusChangedAt: data?.statusChangedAt,
      suspensionReason: data?.suspensionReason,
      openAppeal: data?.openAppeal ?? null,
      lastRejectedAppeal: data?.lastRejectedAppeal ?? null,
    },
  };
}

export function ArtistPortalRouteGate({
  initialProfileMissing,
  initialLoadError,
  initialPortalStatus,
  initialMeta,
  children,
}: ArtistPortalRouteGateProps) {
  const router = useRouter();
  const [missing, setMissing] = useState(initialProfileMissing);
  const [modalOpen, setModalOpen] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);

  useEffect(() => {
    setMissing(initialProfileMissing);
  }, [initialProfileMissing]);

  const blocked = initialPortalStatus === 'deactivated' || initialPortalStatus === 'suspended';

  if (initialLoadError && !initialProfileMissing) {
    return (
      <div className="flex min-h-[min(50vh,24rem)] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="max-w-md text-sm text-destructive">{initialLoadError}</p>
        <Button type="button" variant="outline" onClick={() => router.refresh()}>
          Retry
        </Button>
      </div>
    );
  }

  if (missing) {
    return (
      <>
        <DashboardProfileRequiredPanel
          icon={Mic2}
          title="No artist profile yet"
          description="Create an artist profile to manage your music and videos, submit content for publishing, and appear in the community directory."
          actionLabel="Become an artist"
          onAction={() => setModalOpen(true)}
          secondaryHint="You will complete a short form. When your profile is saved, your artist tools unlock automatically."
        />
        <BecomeArtistModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  if (blocked) {
    return (
      <DashboardRoleAccountStatusPanel
        profileLabel="artist profile"
        portalStatus={initialPortalStatus}
        meta={initialMeta}
        appealEndpoint="ARTIST_SUBMIT_APPEAL"
        reactivateLoading={reactivateLoading}
        onRefresh={() => router.refresh()}
        onReactivate={async () => {
          setReactivateLoading(true);
          const { error } = await callApi('ARTIST_REACTIVATE_ME', {});
          setReactivateLoading(false);
          if (error) {
            toast.error(error.message ?? 'Failed to reactivate');
            return;
          }
          toast.success('Artist profile reactivated');
          router.refresh();
        }}
      />
    );
  }

  return <>{children}</>;
}
