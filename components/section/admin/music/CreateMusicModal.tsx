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
  IArtistCreateMusicPayload,
  IAdminCreateMusicPayload,
} from '@/lib/constants/endpoints';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';

interface CreateMusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateMusicPayload & { artistId: string; ownerUserId: string } = {
  title: '',
  description: '',
  lyrics: '',
  excerpt: '',
  category: '',
  coverImage: '',
  audioUrl: '',
  videoUrl: '',
  downloadUrl: '',
  artistId: '',
  ownerUserId: '',
};

export function CreateMusicModal({ open, onOpenChange, onSuccess }: CreateMusicModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [artistOptions, setArtistOptions] = useState<SelectOption[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setArtistsLoading(true);
    void callApi('ADMIN_ARTISTS_LIST', { query: '?limit=500' })
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
      const payload: IAdminCreateMusicPayload = {
        title: form.title.trim(),
        description: form.description?.trim() ?? '',
        lyrics: form.lyrics?.trim() ?? '',
        excerpt: form.excerpt?.trim() || undefined,
        category: form.category?.trim() || undefined,
        coverImage: form.coverImage?.trim() || undefined,
        audioUrl: form.audioUrl?.trim() || undefined,
        videoUrl: form.videoUrl?.trim() || undefined,
        downloadUrl: form.downloadUrl?.trim() || undefined,
      };
      if (form.artistId) payload.artistId = form.artistId;
      if (form.ownerUserId) payload.ownerUserId = form.ownerUserId;

      const res = await callApi('ADMIN_MUSIC_CREATE', { payload });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create music failed:', err);
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
          <DialogTitle>Create Music</DialogTitle>
          <DialogDescription>Add a new music track</DialogDescription>
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
            description="If set, the server links this user to an artist profile (creating one if needed). Choosing a user clears the artist dropdown; use one linking method if your API rejects both."
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
          <RegularTextarea
            label="Lyrics"
            value={form.lyrics ?? ''}
            onChange={e => setForm(f => ({ ...f, lyrics: e.target.value }))}
            placeholder="Enter lyrics (optional)"
            rows={4}
          />
          <RegularInput
            label="Excerpt"
            value={form.excerpt ?? ''}
            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            placeholder="Short excerpt for cards"
          />
          <RegularInput
            label="Category slug"
            value={form.category ?? ''}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="e.g. sermon, gospel"
          />
          <RegularInput
            label="Cover image URL"
            value={form.coverImage ?? ''}
            onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
          />
          <RegularInput
            label="Audio URL"
            value={form.audioUrl ?? ''}
            onChange={e => setForm(f => ({ ...f, audioUrl: e.target.value }))}
          />
          <RegularInput
            label="Video URL (legacy)"
            value={form.videoUrl ?? ''}
            onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
          />
          <RegularInput
            label="Download URL"
            value={form.downloadUrl ?? ''}
            onChange={e => setForm(f => ({ ...f, downloadUrl: e.target.value }))}
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
