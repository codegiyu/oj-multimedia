'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Store, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardProfileRequiredPanel } from '@/components/section/account/shared/DashboardProfileRequiredPanel';
import { VendorApplicationModal } from '@/components/section/account/shared/VendorApplicationModal';
import { DashboardRoleAccountStatusPanel } from '@/components/section/account/shared/DashboardRoleAccountStatusPanel';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import {
  isRolePortalInactiveOrRejected,
  isRolePortalLifecycleBlocked,
  isRolePortalOperational,
  isRolePortalPending,
} from '@/lib/account/rolePortalAccess';

export { vendorPortalMetaFromApi } from '@/lib/account/vendorPortalLayoutState';

export interface VendorPortalRouteGateProps {
  initialProfileMissing: boolean;
  initialLoadError: string | null;
  initialPortalStatus: RolePortalStatus;
  initialMeta: IRolePortalMeta;
  children: ReactNode;
}

export function VendorPortalRouteGate({
  initialProfileMissing,
  initialLoadError,
  initialPortalStatus,
  initialMeta,
  children,
}: VendorPortalRouteGateProps) {
  const router = useRouter();
  const [missing, setMissing] = useState(initialProfileMissing);
  const [modalOpen, setModalOpen] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);

  useEffect(() => {
    setMissing(initialProfileMissing);
  }, [initialProfileMissing]);

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
          icon={Store}
          title="No vendor store yet"
          description="Apply to open a store on the marketplace to list products, manage orders, and receive buyer enquiries through your dashboard."
          actionLabel="Open a store & become a vendor"
          onAction={() => setModalOpen(true)}
          secondaryHint="Submit your application here. Our team will review it and follow up with you."
        />
        <VendorApplicationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onApplied={() => router.refresh()}
        />
      </>
    );
  }

  if (isRolePortalLifecycleBlocked(initialPortalStatus)) {
    return (
      <DashboardRoleAccountStatusPanel
        profileLabel="vendor store"
        portalStatus={initialPortalStatus}
        meta={initialMeta}
        appealEndpoint="VENDOR_SUBMIT_APPEAL"
        reactivateLoading={reactivateLoading}
        onRefresh={() => router.refresh()}
        onReactivate={async () => {
          setReactivateLoading(true);
          const { error } = await callApi('VENDOR_REACTIVATE_ME', {});
          setReactivateLoading(false);
          if (error) {
            toast.error(error.message ?? 'Failed to reactivate');
            return;
          }
          toast.success('Store reactivated');
          router.refresh();
        }}
      />
    );
  }

  if (isRolePortalPending(initialPortalStatus)) {
    return (
      <Card className="mx-auto max-w-xl border-amber-500/30 bg-amber-500/5">
        <CardContent className="space-y-4 p-8 text-center">
          <Clock className="mx-auto h-10 w-10 text-amber-600" />
          <h2 className="text-lg font-semibold">Application under review</h2>
          <p className="text-sm text-muted-foreground">
            Your vendor application is pending approval. You can prepare your store story with our
            team, but product listings and orders unlock after an admin approves your account.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isRolePortalInactiveOrRejected(initialPortalStatus)) {
    return (
      <Card className="mx-auto max-w-xl border-destructive/30 bg-destructive/5">
        <CardContent className="space-y-4 p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="text-lg font-semibold">Store not active</h2>
          <p className="text-sm text-muted-foreground">
            This vendor store is inactive or was not approved. Contact support or re-apply after
            reviewing any feedback from our team.
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
            Your vendor store is not ready for dashboard tools yet.
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
