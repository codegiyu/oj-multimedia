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
import { callApi } from '@/lib/services/callApi';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { normalizeOptionalHttpUrl } from '@/lib/utils/adminFormValidation';
import { toast } from 'sonner';

interface CreateArtistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  name: '',
  bio: '',
  genre: '',
  image: '',
  coverImage: '',
};

export function CreateArtistModal({
  open,
  onOpenChange,
  editId,
  onSuccess,
}: CreateArtistModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingCoverImage, setPendingCoverImage] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const imageUpload = useFileUpload({
    entityType: 'artist',
    entityId: editId ?? 'artist-pending',
    intent: 'image',
  });
  const coverUpload = useFileUpload({
    entityType: 'artist',
    entityId: editId ?? 'artist-pending',
    intent: 'image',
  });

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setPendingImage(null);
      setPendingCoverImage(null);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setPendingImage(null);
      setPendingCoverImage(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_ARTIST_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.artist) return;
        const a = res.data.artist;
        setForm({
          name: a.name ?? '',
          bio: a.bio ?? '',
          genre: a.genre ?? '',
          image: a.image ?? '',
          coverImage: a.coverImage ?? '',
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
      let finalCoverImage = normalizeOptionalHttpUrl(form.coverImage, 'Cover image URL');

      if (editId) {
        if (pendingImage) {
          const upload = await imageUpload.uploadFile({ file: pendingImage, entityId: editId });
          if (!upload?.url) throw new Error('Profile image upload failed');
          finalImage = upload.url;
        }

        if (pendingCoverImage) {
          const upload = await coverUpload.uploadFile({
            file: pendingCoverImage,
            entityId: editId,
          });
          if (!upload?.url) throw new Error('Cover image upload failed');
          finalCoverImage = upload.url;
        }

        const res = await callApi('ADMIN_ARTIST_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            name: form.name.trim(),
            bio: form.bio?.trim() ?? '',
            genre: form.genre?.trim() ?? '',
            image: finalImage,
            coverImage: finalCoverImage,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const res = await callApi('ADMIN_ARTIST_CREATE', {
          payload: {
            name: form.name.trim(),
            bio: form.bio?.trim() ?? '',
            genre: form.genre?.trim() ?? '',
            image: finalImage || undefined,
            coverImage: finalCoverImage || undefined,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

        const createdId =
          (res.data as { artist?: { _id?: string } } | undefined)?.artist?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        if (createdId && (pendingImage || pendingCoverImage)) {
          if (pendingImage) {
            const upload = await imageUpload.uploadFile({
              file: pendingImage,
              entityId: createdId,
            });
            if (upload?.url) finalImage = upload.url;
          }

          if (pendingCoverImage) {
            const upload = await coverUpload.uploadFile({
              file: pendingCoverImage,
              entityId: createdId,
            });
            if (upload?.url) finalCoverImage = upload.url;
          }

          const patchRes = await callApi('ADMIN_ARTIST_UPDATE', {
            query: `/${createdId}` as `/${string}`,
            payload: {
              image: finalImage,
              coverImage: finalCoverImage,
            },
          });
          if (patchRes.type !== 'success') {
            throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }

      setForm(defaultForm);
      setPendingImage(null);
      setPendingCoverImage(null);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'Artist updated.' : 'Artist created.');
    } catch (err) {
      console.error(isEdit ? 'Update artist failed:' : 'Create artist failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save artist.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setForm(defaultForm);
      setPendingImage(null);
      setPendingCoverImage(null);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit artist' : 'Create artist'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this artist' : 'Add a new artist'}
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
              label="Genre"
              value={form.genre}
              onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
              placeholder="Enter genre"
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
              entityType="artist"
              entityId={editId}
              fallbackEntityIdPrefix="artist-profile"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingImage}
            />
            <MediaUrlOrUploadField
              label="Cover image"
              value={form.coverImage}
              onChange={value => setForm(f => ({ ...f, coverImage: value }))}
              entityType="artist"
              entityId={editId}
              fallbackEntityIdPrefix="artist-cover"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingCoverImage}
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
