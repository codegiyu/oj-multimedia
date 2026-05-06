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
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  vendors: IMarketplaceVendor[];
}

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

const defaultForm = {
  name: '',
  vendorId: '',
  price: 0,
  status: 'draft' as 'draft' | 'published' | 'archived',
};

export function CreateProductModal({
  open,
  onOpenChange,
  onSuccess,
  vendors,
}: CreateProductModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [vendorOptions, setVendorOptions] = useState<SelectOption[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const toOptions = (list: IMarketplaceVendor[]) => [
      { value: '', text: 'Select vendor' },
      ...list.map(v => ({ value: v._id, text: v.storeName })),
    ];
    if (vendors.length > 0) {
      setVendorOptions(toOptions(vendors));
      return;
    }
    setVendorsLoading(true);
    callApi('ADMIN_VENDORS_LIST', {
      query: '?page=1&limit=500&sort=-createdAt' as `?${string}`,
    })
      .then(({ data, error }) => {
        if (error) return;
        const items = (data as { vendors?: IMarketplaceVendor[] })?.vendors ?? [];
        setVendorOptions(toOptions(items));
      })
      .finally(() => setVendorsLoading(false));
  }, [open, vendors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.vendorId) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_PRODUCT_CREATE', {
        payload: {
          name: form.name.trim(),
          vendor: form.vendorId,
          price: Number(form.price) || 0,
          status: form.status,
        },
      });
      if (error) throw new Error(error.message);
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create product failed:', err);
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
      <DialogContent className="max-w-4xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Add a new product</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <RegularInput
            label="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Enter product name"
            required
          />
          <RegularSelect
            label="Vendor"
            value={form.vendorId}
            onSelectChange={v => setForm(f => ({ ...f, vendorId: v }))}
            options={vendorOptions}
            placeholder="Select vendor"
            loading={vendorsLoading}
            required
          />
          <RegularInput
            label="Price"
            type="number"
            min={0}
            step="0.01"
            value={form.price || ''}
            onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
            placeholder="Enter price"
            required
          />
          <RegularSelect
            label="Status"
            value={form.status}
            onSelectChange={v => setForm(f => ({ ...f, status: v as typeof form.status }))}
            options={statusOptions}
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
              disabled={!form.name.trim() || !form.vendorId}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
