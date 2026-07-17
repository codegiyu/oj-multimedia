'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Mic2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardProfileRequiredPanel } from '@/components/section/account/shared/DashboardProfileRequiredPanel';
import { BecomeArtistModal } from '@/components/section/account/shared/BecomeArtistModal';
import { DashboardRoleAccountStatusPanel } from '@/components/section/account/shared/DashboardRoleAccountStatusPanel';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import {
  isRolePortalInactiveOrRejected,
  isRolePortalLifecycleBlocked,
  isRolePortalOperational,
} from '@/lib/account/rolePortalAccess';

export { artistPortalMetaFromMe } from '@/lib/account/artistPortalLayoutState';

export interface ArtistPortalRouteGateProps {
  initialProfileMissing: boolean;
  initialLoadError: string | null;
  initialAuthDeferred?: boolean;
  initialPortalStatus: RolePortalStatus;
  initialMeta: IRolePortalMeta;
  children: ReactNode;
}

export function ArtistPortalRouteGate({
  initialProfileMissing,
  initialLoadError,
  initialAuthDeferred = false,
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

  if (initialAuthDeferred) {
    return <DashboardMainSkeleton />;
  }

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

  if (isRolePortalLifecycleBlocked(initialPortalStatus)) {
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

  if (isRolePortalInactiveOrRejected(initialPortalStatus)) {
    return (
      <Card className="mx-auto max-w-xl border-destructive/30 bg-destructive/5">
        <CardContent className="space-y-4 p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="text-lg font-semibold">Artist profile not active</h2>
          <p className="text-sm text-muted-foreground">
            This artist profile is inactive. Contact support if you need help restoring access.
          </p>
          <Button type="button" variant="outline" onClick={() => router.push('/account')}>
            Back to account
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isRolePortalOperational(initialPortalStatus)) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your artist profile is not ready for portal tools yet.
          </p>
          <Button type="button" variant="outline" onClick={() => router.refresh()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
