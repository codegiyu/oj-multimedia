'use client';

import { useState, useEffect } from 'react';
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

interface CreatePastorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  name: '',
  title: '',
  church: '',
  bio: '',
  image: '',
  ownerUserId: '',
};

export function CreatePastorModal({
  open,
  onOpenChange,
  editId,
  onSuccess,
}: CreatePastorModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const imageUpload = useFileUpload({
    entityType: 'pastor',
    entityId: editId ?? 'pastor-pending',
    intent: 'image',
  });

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setPendingImage(null);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setPendingImage(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_PASTOR_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.pastor) return;
        const p = res.data.pastor;
        setForm({
          name: p.name ?? '',
          title: p.title ?? '',
          church: p.church ?? '',
          bio: (p as { bio?: string }).bio ?? '',
          image: p.image ?? '',
          ownerUserId: (p as { ownerUserId?: string }).ownerUserId ?? '',
        });
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      let finalImage = normalizeOptionalHttpUrl(form.image, 'Profile image URL');

      if (editId) {
        if (pendingImage) {
          const upload = await imageUpload.uploadFile({ file: pendingImage, entityId: editId });
          if (!upload?.url) throw new Error('Profile image upload failed');
          finalImage = upload.url;
        }

        const res = await callApi('ADMIN_PASTOR_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            name: form.name.trim(),
            title: form.title?.trim() ?? '',
            church: form.church?.trim() ?? '',
            bio: form.bio?.trim() ?? '',
            image: finalImage,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const res = await callApi('ADMIN_PASTOR_CREATE', {
          payload: {
            name: form.name.trim(),
            title: form.title?.trim() ?? '',
            church: form.church?.trim() ?? '',
            bio: form.bio?.trim() ?? '',
            image: finalImage || undefined,
            ...(form.ownerUserId ? { ownerUserId: form.ownerUserId } : {}),
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

        const createdId =
          (res.data as { pastor?: { _id?: string } } | undefined)?.pastor?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        if (createdId && pendingImage) {
          const upload = await imageUpload.uploadFile({ file: pendingImage, entityId: createdId });
          if (!upload?.url) throw new Error('Profile image upload failed');
          finalImage = upload.url;

          const patchRes = await callApi('ADMIN_PASTOR_UPDATE', {
            query: `/${createdId}` as `/${string}`,
            payload: { image: finalImage },
          });
          if (patchRes.type !== 'success') {
            throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }

      setForm(defaultForm);
      setPendingImage(null);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'Pastor updated.' : 'Pastor created.');
    } catch (err) {
      console.error(isEdit ? 'Update pastor failed:' : 'Create pastor failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save pastor.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setForm(defaultForm);
      setPendingImage(null);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit pastor' : 'Create pastor'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this pastor' : 'Add a new pastor'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <RegularInput
              label="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Enter name"
              required
            />
            <RegularInput
              label="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Senior Pastor"
            />
            <RegularInput
              label="Church"
              value={form.church}
              onChange={e => setForm(f => ({ ...f, church: e.target.value }))}
              placeholder="Enter church name"
            />
            <RegularTextarea
              label="Bio"
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Enter bio"
              rows={3}
            />
            <MediaUrlOrUploadField
              label="Profile image"
              value={form.image}
              onChange={value => setForm(f => ({ ...f, image: value }))}
              entityType="pastor"
              entityId={editId}
              fallbackEntityIdPrefix="pastor-profile"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingImage}
            />
            {!isEdit ? (
              <AdminUserAccountPicker
                label="Link user account (optional)"
                value={form.ownerUserId}
                onChange={userId => setForm(f => ({ ...f, ownerUserId: userId }))}
                description="Link an existing user as the pastor portal owner."
              />
            ) : null}
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
                text={isEdit ? 'Save' : 'Create'}
                loading={loading}
                disabled={!form.name.trim()}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
