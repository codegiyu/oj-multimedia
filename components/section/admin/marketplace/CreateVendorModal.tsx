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
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';
import { callApi } from '@/lib/services/callApi';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { normalizeOptionalHttpUrl } from '@/lib/utils/adminFormValidation';
import { toast } from 'sonner';

interface CreateVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  storeName: '',
  storeDescription: '',
  logo: '',
  ownerUserId: '',
};

export function CreateVendorModal({ open, onOpenChange, onSuccess }: CreateVendorModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);

  const logoUpload = useFileUpload({
    entityType: 'vendor',
    entityId: 'vendor-pending',
    intent: 'image',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.storeName.trim()) return;
    setLoading(true);
    try {
      let finalLogo = normalizeOptionalHttpUrl(form.logo, 'Logo URL');

      const res = await callApi('ADMIN_VENDOR_CREATE', {
        payload: {
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          storeName: form.storeName.trim(),
          storeDescription: form.storeDescription?.trim() ?? undefined,
          logo: finalLogo || undefined,
          ...(form.ownerUserId ? { ownerUserId: form.ownerUserId } : {}),
        },
      });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

      const createdId =
        (res.data as { vendor?: { _id?: string } } | undefined)?.vendor?._id ??
        (res.data as { _id?: string } | undefined)?._id;

      if (createdId && pendingLogo) {
        const upload = await logoUpload.uploadFile({ file: pendingLogo, entityId: createdId });
        if (!upload?.url) throw new Error('Logo upload failed');
        finalLogo = upload.url;

        const patchRes = await callApi('ADMIN_VENDOR_UPDATE', {
          query: `/${createdId}` as `/${string}`,
          payload: { logo: finalLogo },
        });
        if (patchRes.type !== 'success') {
          throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
        }
      }

      setForm(defaultForm);
      setPendingLogo(null);
      onOpenChange(false);
      onSuccess();
      toast.success('Vendor created.');
    } catch (err) {
      console.error('Create vendor failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to create vendor.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setForm(defaultForm);
      setPendingLogo(null);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Create Vendor</DialogTitle>
          <DialogDescription>Add a new vendor</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <RegularInput
            label="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Enter name"
            required
          />
          <RegularInput
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="Enter email"
          />
          <RegularInput
            label="Phone"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="Enter phone"
          />
          <RegularInput
            label="Store Name"
            value={form.storeName}
            onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
            placeholder="Enter store name"
            required
          />
          <RegularTextarea
            label="Store Description"
            value={form.storeDescription}
            onChange={e => setForm(f => ({ ...f, storeDescription: e.target.value }))}
            placeholder="Enter store description"
            rows={3}
          />
          <MediaUrlOrUploadField
            label="Logo"
            value={form.logo}
            onChange={value => setForm(f => ({ ...f, logo: value }))}
            entityType="vendor"
            fallbackEntityIdPrefix="vendor-logo"
            intent="image"
            accept="image/*"
            defaultMode="upload"
            onPendingFileChange={setPendingLogo}
          />
          <AdminUserAccountPicker
            label="Link user account (optional)"
            value={form.ownerUserId}
            onChange={userId => setForm(f => ({ ...f, ownerUserId: userId }))}
            description="Link an existing user as the vendor dashboard owner."
          />
          <DialogFooter>
            <RegularBtn
              type="button"
              text="Cancel"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            />
            <RegularBtn
              type="submit"
              text="Create"
              loading={loading}
              disabled={!form.name.trim() || !form.storeName.trim()}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
