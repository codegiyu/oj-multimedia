'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { DashboardFormCard } from '@/components/layout/user-dashboard/DashboardFormCard';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AllEndpoints } from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';

export interface RoleAccountDeactivateSectionProps {
  profileLabel: string;
  deactivateEndpoint: Extract<
    keyof AllEndpoints,
    'VENDOR_DEACTIVATE_ME' | 'ARTIST_DEACTIVATE_ME' | 'PASTOR_DEACTIVATE_ME'
  >;
  isDeactivated?: boolean;
}

export function RoleAccountDeactivateSection({
  profileLabel,
  deactivateEndpoint,
  isDeactivated,
}: RoleAccountDeactivateSectionProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isDeactivated) {
    return null;
  }

  const handleDeactivate = async () => {
    setLoading(true);
    const { error, message } = await callApi(deactivateEndpoint, {});
    setLoading(false);

    if (error) {
      toast.error(error.message ?? message ?? 'Failed to deactivate');
      return;
    }

    toast.success(`${profileLabel} deactivated`);
    setConfirmOpen(false);
    router.refresh();
  };

  return (
    <>
      <DashboardFormCard
        title="Deactivate profile"
        description={`Hide your ${profileLabel} from the public site. You can reactivate it later from the dashboard home.`}
        icon={AlertTriangle}>
        <p className="text-sm text-muted-foreground">
          Deactivation does not delete your content. Admin suspension is separate and requires an
          appeal.
        </p>
        <RegularBtn
          className="mt-4"
          variant="destructive"
          text={`Deactivate ${profileLabel}`}
          onClick={() => setConfirmOpen(true)}
        />
      </DashboardFormCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate {profileLabel}?</DialogTitle>
            <DialogDescription>
              Your profile will be hidden from search and public pages until you reactivate it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <RegularBtn text="Cancel" variant="secondary" onClick={() => setConfirmOpen(false)} />
            <RegularBtn
              text="Deactivate"
              variant="destructive"
              loading={loading}
              onClick={() => void handleDeactivate()}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
