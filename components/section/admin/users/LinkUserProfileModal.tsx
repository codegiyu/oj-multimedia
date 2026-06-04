'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import {
  AdminUnlinkedEntityPicker,
  type UnlinkedEntityKind,
} from '@/components/section/admin/shared/AdminUnlinkedEntityPicker';
import type { UserListItem } from '@/lib/types/adminUsers';
import { formatUserDisplayName } from '@/lib/utils/formatUserDisplayName';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';

const COPY: Record<
  UnlinkedEntityKind,
  { title: string; label: string; field: 'artistId' | 'vendorId' | 'pastorId' }
> = {
  artist: {
    title: 'Link artist profile',
    label: 'Artist profile',
    field: 'artistId',
  },
  vendor: {
    title: 'Link vendor store',
    label: 'Vendor store',
    field: 'vendorId',
  },
  pastor: {
    title: 'Link pastor profile',
    label: 'Pastor profile',
    field: 'pastorId',
  },
};

interface LinkUserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListItem | null;
  entityKind: UnlinkedEntityKind;
  onSuccess: () => void;
}

export function LinkUserProfileModal({
  open,
  onOpenChange,
  user,
  entityKind,
  onSuccess,
}: LinkUserProfileModalProps) {
  const [entityId, setEntityId] = useState('');
  const [loading, setLoading] = useState(false);
  const copy = COPY[entityKind];

  const handleOpenChange = (val: boolean) => {
    if (!val) setEntityId('');
    onOpenChange(val);
  };

  const handleConfirm = async () => {
    if (!user || !entityId) return;
    setLoading(true);

    const { error, message } = await callApi('ADMIN_USER_UPDATE', {
      query: `/${user._id}` as `/${string}`,
      payload: { [copy.field]: entityId },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message ?? message ?? 'Link failed');
      return;
    }

    toast.success('Profile linked');
    setEntityId('');
    onOpenChange(false);
    onSuccess();
  };

  const displayName = user ? formatUserDisplayName(user) : '';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>
            Search for an unlinked {entityKind} profile to attach to {displayName}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <AdminUnlinkedEntityPicker
            entityKind={entityKind}
            label={copy.label}
            value={entityId}
            onChange={id => setEntityId(id)}
            disabled={loading}
            description="Only profiles not linked to another user are shown."
          />
        </div>

        <DialogFooter>
          <RegularBtn
            text="Cancel"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          />
          <RegularBtn
            text="Link profile"
            onClick={() => void handleConfirm()}
            loading={loading}
            disabled={!entityId}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
