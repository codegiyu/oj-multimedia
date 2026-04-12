'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardProfileRequiredPanel } from '@/components/section/account/shared/DashboardProfileRequiredPanel';
import { VendorApplicationModal } from '@/components/section/account/shared/VendorApplicationModal';

export interface VendorPortalRouteGateProps {
  initialProfileMissing: boolean;
  initialLoadError: string | null;
  children: ReactNode;
}

export function VendorPortalRouteGate({
  initialProfileMissing,
  initialLoadError,
  children,
}: VendorPortalRouteGateProps) {
  const router = useRouter();
  const [missing, setMissing] = useState(initialProfileMissing);
  const [modalOpen, setModalOpen] = useState(false);

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

  return <>{children}</>;
}
