'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardProfileRequiredPanel } from '@/components/section/account/shared/DashboardProfileRequiredPanel';
import { VendorApplicationModal } from '@/components/section/account/shared/VendorApplicationModal';
import { DashboardRoleAccountStatusPanel } from '@/components/section/account/shared/DashboardRoleAccountStatusPanel';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';

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

  if (blocked) {
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

  return <>{children}</>;
}

export function vendorPortalMetaFromApi(vendor: IMarketplaceVendor | undefined): {
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
} {
  const portalStatus = (vendor?.portalStatus ?? vendor?.status ?? 'active') as RolePortalStatus;

  return {
    portalStatus,
    meta: {
      portalStatus,
      statusChangedAt: vendor?.statusChangedAt,
      suspensionReason: vendor?.suspensionReason,
      openAppeal: vendor?.openAppeal ?? null,
      lastRejectedAppeal: vendor?.lastRejectedAppeal ?? null,
    },
  };
}
