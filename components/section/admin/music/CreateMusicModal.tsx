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
import type { IArtistCreateMusicPayload } from '@/lib/constants/endpoints';

interface CreateMusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateMusicPayload & { artistId: string } = {
  title: '',
  description: '',
  lyrics: '',
  artistId: '',
};

export function CreateMusicModal({ open, onOpenChange, onSuccess }: CreateMusicModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [artistOptions, setArtistOptions] = useState<SelectOption[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setArtistsLoading(true);
    callApi('ADMIN_ARTISTS_LIST', { query: '?limit=500' })
      .then(({ data }) => {
        const artists = (data as { artists?: { _id: string; name: string }[] })?.artists ?? [];
        setArtistOptions([
          { text: 'Select artist', value: '' },
          ...artists.map(a => ({ text: a.name, value: a._id })),
        ]);
      })
      .finally(() => setArtistsLoading(false));
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.artistId || !form.title.trim()) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_MUSIC_CREATE', {
        payload: {
          title: form.title.trim(),
          description: form.description?.trim() ?? '',
          lyrics: form.lyrics?.trim() ?? '',
          artistId: form.artistId,
        },
      });
      if (error) throw new Error(error.message);
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
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Create Music</DialogTitle>
          <DialogDescription>Add a new music track</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <RegularSelect
            label="Artist"
            value={form.artistId}
            onSelectChange={v => setForm(f => ({ ...f, artistId: v }))}
            options={artistOptions}
            loading={artistsLoading}
            required
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
              disabled={!form.artistId || !form.title.trim()}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
