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
import type { IArtistCreateVideoPayload } from '@/lib/constants/endpoints';

interface CreateVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateVideoPayload & { artistId: string } = {
  title: '',
  description: '',
  artistId: '',
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
      const { error } = await callApi('ADMIN_VIDEO_CREATE', {
        payload: {
          title: form.title.trim(),
          description: form.description?.trim() ?? '',
          artistId: form.artistId,
        },
      });
      if (error) throw new Error(error.message);
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
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Create Video</DialogTitle>
          <DialogDescription>Add a new video</DialogDescription>
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
