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
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import type { SelectOption } from '@/lib/types/general';
import type { IMarketplaceVendor } from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { normalizeOptionalHttpUrl } from '@/lib/utils/adminFormValidation';
import { toast } from 'sonner';

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  vendors: IMarketplaceVendor[];
}

const MAX_GALLERY_IMAGES = 4;

const defaultForm = {
  name: '',
  vendorId: '',
  price: 0,
  status: 'draft' as 'draft' | 'published' | 'archived',
  images: [''] as string[],
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
  const [pendingImages, setPendingImages] = useState<(File | null)[]>([null]);

  const imageUpload = useFileUpload({
    entityType: 'product',
    entityId: 'product-pending',
    intent: 'image',
  });

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

  const resetForm = () => {
    setForm(defaultForm);
    setPendingImages([null]);
  };

  const updateImageAt = (index: number, value: string) => {
    setForm(f => {
      const images = [...f.images];
      images[index] = value;
      return { ...f, images };
    });
  };

  const updatePendingAt = (index: number, file: File | null) => {
    setPendingImages(prev => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const addGallerySlot = () => {
    if (form.images.length >= MAX_GALLERY_IMAGES + 1) return;
    setForm(f => ({ ...f, images: [...f.images, ''] }));
    setPendingImages(prev => [...prev, null]);
  };

  const removeGallerySlot = (index: number) => {
    if (index === 0 || form.images.length <= 1) return;
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
    createStatus: 'draft' | 'published' = 'draft'
  ) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.vendorId) return;
    setLoading(true);
    try {
      const initialImages = form.images
        .map(url => normalizeOptionalHttpUrl(url, 'Product image URL'))
        .filter(Boolean);

      const res = await callApi('ADMIN_PRODUCT_CREATE', {
        payload: {
          name: form.name.trim(),
          vendorId: form.vendorId,
          price: Number(form.price) || 0,
          status: createStatus,
          images: initialImages.length > 0 ? initialImages : undefined,
        },
      });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

      const createdId =
        (res.data as { product?: { _id?: string } } | undefined)?.product?._id ??
        (res.data as { _id?: string } | undefined)?._id;

      if (createdId && pendingImages.some(Boolean)) {
        const finalImages = [...initialImages];

        for (let index = 0; index < pendingImages.length; index++) {
          const pendingFile = pendingImages[index];
          if (!pendingFile) continue;

          const upload = await imageUpload.uploadFile({ file: pendingFile, entityId: createdId });
          if (!upload?.url) throw new Error('Product image upload failed');

          if (finalImages[index]) {
            finalImages[index] = upload.url;
          } else {
            finalImages.push(upload.url);
          }
        }

        const patchRes = await callApi('ADMIN_PRODUCT_UPDATE', {
          query: `/${createdId}` as `/${string}`,
          payload: { images: finalImages },
        });
        if (patchRes.type !== 'success') {
          throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
        }
      }

      resetForm();
      onOpenChange(false);
      onSuccess();
      toast.success('Product created.');
    } catch (err) {
      console.error('Create product failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to create product.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Add a new product</DialogDescription>
        </DialogHeader>
        <form onSubmit={e => void handleSubmit(e)} className="grid gap-4">
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
          {form.images.map((imageUrl, index) => (
            <div key={`product-image-${index}`} className="grid gap-2">
              <MediaUrlOrUploadField
                label={index === 0 ? 'Primary image' : `Gallery image ${index}`}
                value={imageUrl}
                onChange={value => updateImageAt(index, value)}
                entityType="product"
                fallbackEntityIdPrefix={`product-image-${index}`}
                intent="image"
                accept="image/*"
                defaultMode="upload"
                onPendingFileChange={file => updatePendingAt(index, file)}
              />
              {index > 0 ? (
                <RegularBtn
                  type="button"
                  text="Remove image"
                  variant="ghost"
                  onClick={() => removeGallerySlot(index)}
                  disabled={loading}
                />
              ) : null}
            </div>
          ))}
          {form.images.length < MAX_GALLERY_IMAGES + 1 ? (
            <RegularBtn
              type="button"
              text="Add gallery image"
              variant="outline"
              onClick={addGallerySlot}
              disabled={loading}
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
              type="button"
              text="Create as draft"
              loading={loading}
              onClick={() => void handleSubmit(undefined, 'draft')}
              disabled={!form.name.trim() || !form.vendorId || loading}
            />
            <RegularBtn
              type="button"
              text="Create & publish"
              loading={loading}
              onClick={() => void handleSubmit(undefined, 'published')}
              disabled={!form.name.trim() || !form.vendorId || loading}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
