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
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { callApi } from '@/lib/services/callApi';
import type {
  IArtistCreateVideoPayload,
  IAdminCreateVideoPayload,
} from '@/lib/constants/endpoints';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';

interface CreateVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateVideoPayload & { artistId: string; ownerUserId: string } = {
  title: '',
  description: '',
  thumbnail: '',
  videoUrl: '',
  videoFileUrl: '',
  embedUrl: '',
  category: '',
  artistId: '',
  ownerUserId: '',
};

export function CreateVideoModal({ open, onOpenChange, onSuccess }: CreateVideoModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [artistOptions, setArtistOptions] = useState<SelectOption[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setArtistsLoading(true);
    callApi('ADMIN_ARTISTS_LIST', { query: '?limit=500' })
      .then(res => {
        if (res.type !== 'success') return;
        const artists = res.data.artists ?? [];
        setArtistOptions([
          { text: 'No artist profile (optional)', value: '' },
          ...artists.map(a => ({ text: a.name, value: a._id })),
        ]);
      })
      .finally(() => setArtistsLoading(false));
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const payload: IAdminCreateVideoPayload = {
        title: form.title.trim(),
        description: form.description?.trim() ?? '',
        thumbnail: form.thumbnail?.trim() || undefined,
        videoUrl: form.videoUrl?.trim() || undefined,
        videoFileUrl: form.videoFileUrl?.trim() || undefined,
        embedUrl: form.embedUrl?.trim() || undefined,
        category: form.category?.trim() || undefined,
      };
      if (form.artistId) payload.artistId = form.artistId;
      if (form.ownerUserId) payload.ownerUserId = form.ownerUserId;

      const res = await callApi('ADMIN_VIDEO_CREATE', { payload });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create video failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setForm(defaultForm);
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Create Video</DialogTitle>
          <DialogDescription>Add a new video</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <RegularSelect
            label="Artist profile (optional)"
            value={form.artistId}
            onSelectChange={v => setForm(f => ({ ...f, artistId: v }))}
            options={artistOptions}
            loading={artistsLoading}
          />
          <AdminUserAccountPicker
            value={form.ownerUserId}
            onChange={(userId, _u) =>
              setForm(f => ({
                ...f,
                ownerUserId: userId,
                ...(userId ? { artistId: '' } : {}),
              }))
            }
          />
          <RegularInput
            label="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Enter title"
            required
          />
          <RegularTextarea
            label="Description"
            value={form.description ?? ''}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Enter description"
            rows={3}
          />
          <RegularInput
            label="Category slug"
            value={form.category ?? ''}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="e.g. movie, music"
          />
          <RegularInput
            label="Thumbnail URL"
            value={form.thumbnail ?? ''}
            onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
          />
          <RegularInput
            label="Video file URL"
            value={form.videoFileUrl ?? ''}
            onChange={e => setForm(f => ({ ...f, videoFileUrl: e.target.value }))}
          />
          <RegularInput
            label="Embed URL (YouTube)"
            value={form.embedUrl ?? ''}
            onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
          />
          <RegularInput
            label="Legacy videoUrl"
            value={form.videoUrl ?? ''}
            onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
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
              disabled={!form.title.trim()}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
