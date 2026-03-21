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
import { callApi } from '@/lib/services/callApi';

interface CreatePastorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const defaultForm = {
  name: '',
  title: '',
  church: '',
  bio: '',
};

export function CreatePastorModal({ open, onOpenChange, onSuccess }: CreatePastorModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_PASTOR_CREATE', {
        payload: {
          name: form.name.trim(),
          title: form.title?.trim() ?? '',
          church: form.church?.trim() ?? '',
          bio: form.bio?.trim() ?? '',
        },
      });
      if (error) throw new Error(error.message);
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create pastor failed:', err);
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
          <DialogTitle>Create Pastor</DialogTitle>
          <DialogDescription>Add a new pastor</DialogDescription>
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
              disabled={!form.name.trim()}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
