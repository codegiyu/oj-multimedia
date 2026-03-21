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
};

export function CreateVendorModal({ open, onOpenChange, onSuccess }: CreateVendorModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.storeName.trim()) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_VENDOR_CREATE', {
        payload: {
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          storeName: form.storeName.trim(),
          storeDescription: form.storeDescription?.trim() ?? undefined,
        },
      });
      if (error) throw new Error(error.message);
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create vendor failed:', err);
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
