/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import type { UserListItem } from '@/lib/types/adminUsers';
import { USER_ACCOUNT_STATUS_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';
import {
  loadAdminArtistSelectOptions,
  loadAdminVendorSelectOptions,
} from '@/lib/utils/adminEntitySelect';
import type { SelectOption } from '@/lib/types/general';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';

interface ManageUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListItem | null;
  onSuccess: () => void;
}

const NONE_OPTION: SelectOption = { text: 'Not linked', value: '' };

export function ManageUserModal({ open, onOpenChange, user, onSuccess }: ManageUserModalProps) {
  const [accountStatus, setAccountStatus] = useState('active');
  const [artistId, setArtistId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [artistOptions, setArtistOptions] = useState<SelectOption[]>([NONE_OPTION]);
  const [vendorOptions, setVendorOptions] = useState<SelectOption[]>([NONE_OPTION]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    setAccountStatus(user.accountStatus);
    setArtistId(user.artistId ?? '');
    setVendorId(user.vendorId ?? '');

    void Promise.all([loadAdminArtistSelectOptions(), loadAdminVendorSelectOptions()]).then(
      ([artists, vendors]) => {
        setArtistOptions([NONE_OPTION, ...artists]);
        setVendorOptions([NONE_OPTION, ...vendors]);
      }
    );
  }, [open, user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const payload: {
      accountStatus?: string;
      artistId?: string | null;
      vendorId?: string | null;
    } = {};

    if (accountStatus !== user.accountStatus) {
      payload.accountStatus = accountStatus;
    }

    const nextArtistId = artistId || null;
    const nextVendorId = vendorId || null;
    const prevArtistId = user.artistId ?? null;
    const prevVendorId = user.vendorId ?? null;

    if (nextArtistId !== prevArtistId) {
      payload.artistId = nextArtistId;
    }

    if (nextVendorId !== prevVendorId) {
      payload.vendorId = nextVendorId;
    }

    if (Object.keys(payload).length === 0) {
      toast.message('No changes to save');
      setLoading(false);
      onOpenChange(false);
      return;
    }

    const { error, message } = await callApi('ADMIN_USER_UPDATE', {
      query: `/${user._id}` as `/${string}`,
      payload,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message ?? message ?? 'Update failed');
      return;
    }

    toast.success('User updated');
    onOpenChange(false);
    onSuccess();
  };

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage account</DialogTitle>
          <DialogDescription>Update status and profile links for {displayName}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <RegularSelect
            label="Account status"
            value={accountStatus}
            options={[...USER_ACCOUNT_STATUS_SELECT_OPTIONS]}
            onSelectChange={setAccountStatus}
          />
          <RegularSelect
            label="Linked artist"
            value={artistId}
            options={artistOptions}
            onSelectChange={setArtistId}
          />
          <RegularSelect
            label="Linked vendor"
            value={vendorId}
            options={vendorOptions}
            onSelectChange={setVendorId}
          />
        </div>

        <DialogFooter>
          <RegularBtn text="Cancel" variant="secondary" onClick={() => onOpenChange(false)} />
          <RegularBtn text="Save changes" onClick={() => void handleSave()} loading={loading} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
