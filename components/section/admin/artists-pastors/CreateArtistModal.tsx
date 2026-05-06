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
import { callApi } from '@/lib/services/callApi';

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

  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
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
      if (editId) {
        const res = await callApi('ADMIN_ARTIST_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            name: form.name.trim(),
            bio: form.bio?.trim() ?? '',
            genre: form.genre?.trim() ?? '',
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const { error } = await callApi('ADMIN_ARTIST_CREATE', {
          payload: {
            name: form.name.trim(),
            bio: form.bio?.trim() ?? '',
            genre: form.genre?.trim() ?? '',
          },
        });
        if (error) throw new Error(error.message);
      }
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error(isEdit ? 'Update artist failed:' : 'Create artist failed:', err);
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
      <DialogContent className="max-w-xl" showCloseButton={!loading}>
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
