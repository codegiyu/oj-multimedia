/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { useForm } from '@/lib/hooks/use-form';
import { callApi } from '@/lib/services/callApi';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import type {
  IVendorCreateProductPayload,
  IMarketplaceCategory,
  IMarketplaceSubCategory,
  IMarketplaceVariationOption,
  IMarketplaceProductVariant,
} from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  buildVariantsFromOptions,
  setDefaultVariant,
  ensureSingleDefault,
} from '@/lib/utils/productVariations';
import { formatPrice } from '@/lib/utils/marketplace';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_OTHER_IMAGES = 9;

const newProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  tagsString: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  imageUrl: z.string().optional(),
  otherImages: z.array(z.string()).max(MAX_OTHER_IMAGES).optional(),
});

type NewProductValues = z.infer<typeof newProductSchema>;

function getSubmitValidationMessages(
  values: NewProductValues,
  errors: Partial<Record<keyof NewProductValues | 'root', string[] | undefined>>,
  hasVariations: boolean,
  variationOptions: IMarketplaceVariationOption[],
  variants: IMarketplaceProductVariant[]
): string[] {
  const messages: string[] = [];
  if (!values.name?.trim()) messages.push('Product name is required');
  if (Number(values.price) < 0) messages.push('Price must be 0 or greater');
  (['name', 'price', 'description', 'category', 'subCategory', 'tagsString'] as const).forEach(
    key => {
      const arr = errors[key];
      if (Array.isArray(arr)) arr.forEach(m => messages.push(m));
    }
  );
  if (hasVariations) {
    const hasValidOption = variationOptions.some(
      o => o.name?.trim() && o.values?.length > 0 && o.values.some(v => v?.trim())
    );
    if (!hasValidOption) {
      messages.push('Add at least one variation option with at least one value.');
    }
    if (variants.length === 0 && hasValidOption) {
      messages.push('Variants could not be generated; check variation options.');
    }
    const defaultCount = variants.filter(v => v.isDefault).length;
    if (defaultCount !== 1 && variants.length > 0) {
      messages.push('Exactly one variant must be set as default.');
    }
  }
  return [...new Set(messages)];
}

function parseTags(tagsString: string | undefined): string[] {
  if (!tagsString || !tagsString.trim()) return [];
  return tagsString
    .split(/[,;]/)
    .map(t => t.trim())
    .filter(Boolean);
}

function variantLabel(options: Record<string, string>): string {
  return Object.entries(options)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' · ');
}

export function VendorNewProductPageClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<IMarketplaceCategory[]>([]);
  const [subcategories, setSubcategories] = useState<IMarketplaceSubCategory[]>([]);
  const [vendorId, setVendorId] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);
  const [hasVariations, setHasVariations] = useState(false);
  const [variationOptions, setVariationOptions] = useState<IMarketplaceVariationOption[]>([]);
  const [variants, setVariants] = useState<IMarketplaceProductVariant[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      const [categoriesRes, vendorRes] = await Promise.all([
        callApi('MARKETPLACE_GET_CATEGORIES', {}),
        callApi('VENDOR_GET_ME', {}),
      ]);

      if (cancelled) return;

      if (categoriesRes.data?.categories) {
        setCategories(categoriesRes.data.categories);
      }
      if (vendorRes.type === 'success' && vendorRes.data?._id) {
        setVendorId(vendorRes.data._id);
      }
      setLoadingCategories(false);
    }

    void loadMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAllSubcategories() {
      setLoadingSubcategories(true);
      const res = await callApi('MARKETPLACE_GET_SUBCATEGORIES', {});
      if (cancelled) return;
      if (res.data?.subcategories) {
        setSubcategories(res.data.subcategories);
      } else {
        setSubcategories([]);
      }
      setLoadingSubcategories(false);
    }

    void loadAllSubcategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    formValues,
    formErrors,
    loading: submitting,
    handleInputChange,
    handleSubmit,
    errorsVisible,
    onChange,
    setFormValues,
    isValid,
  } = useForm<typeof newProductSchema>({
    formSchema: newProductSchema,
    defaultFormValues: {
      name: '',
      description: '',
      category: '',
      subCategory: '',
      tagsString: '',
      price: 0,
      inStock: true,
      isFeatured: false,
      imageUrl: '',
      otherImages: [],
    },
    async onSubmit(values: NewProductValues) {
      const tags = parseTags(values.tagsString);
      const basePrice = Number(values.price);

      const mainImage = values.imageUrl?.trim() || undefined;
      const otherImages = (values.otherImages || []).filter((url): url is string => !!url?.trim());
      const images = mainImage
        ? [mainImage, ...otherImages]
        : otherImages.length
          ? otherImages
          : undefined;

      let payload: IVendorCreateProductPayload = {
        name: values.name,
        description: values.description || undefined,
        category: values.category || undefined,
        subCategory: values.subCategory || undefined,
        tags: tags.length > 0 ? tags : undefined,
        price: basePrice,
        inStock: values.inStock ?? true,
        isFeatured: values.isFeatured,
        images,
      };

      if (hasVariations && variationOptions.length > 0 && variants.length > 0) {
        const validOptions = variationOptions.filter(
          o => o.name?.trim() && o.values?.length > 0 && o.values.some(v => v?.trim())
        );
        if (validOptions.length === 0) {
          toast.error('Add at least one variation option with at least one value.');
          return false;
        }
        const finalVariants = ensureSingleDefault(variants);
        const minPrice = Math.min(...finalVariants.map(v => v.price));
        payload = {
          ...payload,
          price: minPrice,
          variationOptions: validOptions.map(o => ({
            name: o.name.trim(),
            values: o.values.map(v => v.trim()).filter(Boolean),
          })),
          variants: finalVariants.map(({ options, price, inStock, isDefault, sku, image }) => ({
            options,
            price,
            inStock,
            isDefault,
            ...(sku && { sku }),
            ...(image && { image }),
          })),
        };
      }

      const { data, error, message } = await callApi('VENDOR_CREATE_PRODUCT', {
        payload,
      });

      if (error || !data) {
        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
        if (responseCode === 403 || responseCode === 404) {
          toast.error('You need a vendor store to add products.');
          router.push('/account/vendor');
          return false;
        }
        toast.error(message || 'Failed to create product.');
        return false;
      }

      toast.success('Product created.');
      router.push('/account/vendor/products');
      return true;
    },
  });

  const recomputeVariants = useCallback(
    (opts: IMarketplaceVariationOption[], currentVariants: IMarketplaceProductVariant[]) => {
      const next = buildVariantsFromOptions(opts, currentVariants, formValues.price || 0);
      setVariants(next);
    },
    [formValues.price]
  );

  useEffect(() => {
    if (!hasVariations || variationOptions.length === 0) return;
    recomputeVariants(variationOptions, variants);
  }, [hasVariations, variationOptions]);

  const addVariationOption = () => {
    setVariationOptions(prev => [...prev, { name: '', values: [''] }]);
  };

  const removeVariationOption = (index: number) => {
    setVariationOptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariationOption = (
    index: number,
    field: 'name' | 'values',
    value: string | string[]
  ) => {
    setVariationOptions(prev => {
      const next = [...prev];
      if (field === 'name') next[index] = { ...next[index], name: value as string };
      else next[index] = { ...next[index], values: value as string[] };
      return next;
    });
  };

  const updateVariantValue = (
    index: number,
    field: keyof IMarketplaceProductVariant,
    value: number | boolean | string
  ) => {
    setVariants(prev => {
      const next = [...prev];
      const v = next[index];
      if (!v) return prev;
      if (field === 'price') next[index] = { ...v, price: value as number };
      else if (field === 'inStock') next[index] = { ...v, inStock: value as boolean };
      else if (field === 'sku') next[index] = { ...v, sku: value as string };
      else if (field === 'image') next[index] = { ...v, image: value as string };
      else if (field === 'isDefault' && value === true) return setDefaultVariant(prev, index);
      return next;
    });
  };

  const setVariantDefault = (index: number) => {
    setVariants(prev => setDefaultVariant(prev, index));
  };

  const otherImages = formValues.otherImages ?? [];
  const updateOtherImage = (index: number, url: string) => {
    setFormValues(prev => {
      const arr = [...(prev.otherImages ?? [])];
      arr[index] = url;
      return { ...prev, otherImages: arr };
    });
  };
  const addOtherImage = () => {
    if (otherImages.length >= MAX_OTHER_IMAGES) return;
    setFormValues(prev => ({
      ...prev,
      otherImages: [...(prev.otherImages ?? []), ''],
    }));
  };
  const removeOtherImage = (index: number) => {
    setFormValues(prev => {
      const arr = (prev.otherImages ?? []).filter((_, i) => i !== index);
      return { ...prev, otherImages: arr };
    });
  };

  const selectedCategoryId = formValues.category;
  const subcategoriesForCategory = selectedCategoryId
    ? subcategories.filter(s => s.category === selectedCategoryId)
    : [];

  const categoryOptions = [
    { text: '— None (Other) —', value: '' },
    ...categories.map(cat => ({ text: cat.name, value: cat._id })),
  ];
  const subCategoryOptions = [
    { text: '— None (Other) —', value: '' },
    ...subcategoriesForCategory.map(sub => ({ text: sub.name, value: sub._id })),
  ];

  const variationValidationFailed =
    hasVariations &&
    (variationOptions.length === 0 ||
      !variationOptions.some(
        o => o.name?.trim() && o.values?.length > 0 && o.values.some(v => v?.trim())
      ) ||
      (variants.length > 0 && variants.filter(v => v.isDefault).length !== 1));
  const canSubmit =
    isValid && !variationValidationFailed && (!hasVariations || variants.length > 0) && !submitting;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <DashboardPageHeader title="Add product" description="Create a new listing for your store." />
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <RegularInput
            label="Product name"
            name="name"
            required
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            disabled={submitting}
            errors={errorsVisible ? (formErrors.name ?? []) : []}
          />
          <RegularTextarea
            label="Description"
            name="description"
            value={formValues.description ?? ''}
            onChange={handleInputChange}
            placeholder="Describe your product"
            rows={3}
            disabled={submitting}
          />

          <RegularSelect
            label="Category (optional)"
            name="category"
            value={formValues.category ?? ''}
            placeholder="— None (Other) —"
            onSelectChange={v => {
              onChange('category', v);
              onChange('subCategory', '');
            }}
            options={categoryOptions}
            disabled={submitting}
            loading={loadingCategories}
          />
          <RegularSelect
            label="Subcategory (optional)"
            name="subCategory"
            value={formValues.subCategory ?? ''}
            placeholder="— None (Other) —"
            onSelectChange={v => onChange('subCategory', v)}
            options={subCategoryOptions}
            disabled={submitting || !selectedCategoryId}
            loading={loadingSubcategories}
          />

          <RegularInput
            label="Tags (optional)"
            name="tagsString"
            placeholder="e.g. organic, handmade, gift"
            value={formValues.tagsString ?? ''}
            onChange={handleInputChange}
            disabled={submitting}
            subtext={
              <span className="text-xs text-muted-foreground">
                Comma- or semicolon-separated for easier search and filtering.
              </span>
            }
          />

          {!hasVariations && (
            <>
              <RegularInput
                label="Price"
                name="price"
                type="number"
                min={0}
                step={0.01}
                value={formValues.price === 0 ? '' : String(formValues.price)}
                onChange={handleInputChange}
                disabled={submitting}
                errors={errorsVisible ? (formErrors.price ?? []) : []}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formValues.inStock ?? true}
                  onChange={e => onChange('inStock', e.target.checked)}
                  disabled={submitting}
                  className="rounded border-input"
                />
                <Label htmlFor="inStock" className="cursor-pointer">
                  In stock
                </Label>
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasVariations"
              checked={hasVariations}
              onChange={e => {
                const checked = e.target.checked;
                setHasVariations(checked);
                if (!checked) {
                  setVariationOptions([]);
                  setVariants([]);
                }
              }}
              disabled={submitting}
              className="rounded border-input"
            />
            <Label htmlFor="hasVariations" className="cursor-pointer">
              This product has variations (e.g. size, colour)
            </Label>
          </div>

          {hasVariations && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Variation options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariationOption}
                    disabled={submitting}
                    className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add option
                  </Button>
                </div>
                {variationOptions.map((opt, idx) => (
                  <Card key={idx} className="p-3 space-y-2">
                    <div className="flex gap-2 items-center">
                      <RegularInput
                        label=""
                        name={`opt-name-${idx}`}
                        placeholder="e.g. Colour"
                        value={opt.name}
                        onChange={e => updateVariationOption(idx, 'name', e.target.value)}
                        disabled={submitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariationOption(idx)}
                        disabled={submitting}
                        aria-label="Remove option">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {opt.values.map((val, vIdx) => (
                        <div key={vIdx} className="flex gap-1 items-center">
                          <input
                            type="text"
                            placeholder="Value"
                            value={val}
                            onChange={e => {
                              const arr = [...opt.values];
                              arr[vIdx] = e.target.value;
                              updateVariationOption(idx, 'values', arr);
                            }}
                            disabled={submitting}
                            className="flex-1 min-w-[80px] rounded border border-input bg-background px-2 py-1.5 text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateVariationOption(
                                idx,
                                'values',
                                opt.values.filter((_, i) => i !== vIdx)
                              )
                            }
                            disabled={submitting || opt.values.length <= 1}
                            aria-label="Remove value">
                            <Trash2 className="w-3 h-3 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateVariationOption(idx, 'values', [...opt.values, ''])}
                        disabled={submitting}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add value
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {variants.length > 0 && (
                <div className="space-y-2">
                  <Label>Variants (one per combination)</Label>
                  <p className="text-xs text-muted-foreground">
                    Set price, stock and default. Exactly one variant must be the default.
                  </p>
                  <div className="border rounded-lg divide-y max-h-[320px] overflow-auto">
                    {variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-card">
                        <div className="sm:col-span-3 text-sm font-medium text-foreground">
                          {variantLabel(v.options)}
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs text-muted-foreground">Price</Label>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={v.price}
                            onChange={e =>
                              updateVariantValue(idx, 'price', parseFloat(e.target.value) || 0)
                            }
                            disabled={submitting}
                            className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`variant-instock-${idx}`}
                            checked={v.inStock}
                            onChange={e => updateVariantValue(idx, 'inStock', e.target.checked)}
                            disabled={submitting}
                            className="rounded border-input"
                          />
                          <Label htmlFor={`variant-instock-${idx}`} className="text-xs">
                            In stock
                          </Label>
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs text-muted-foreground">Default</Label>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="defaultVariant"
                              checked={v.isDefault}
                              onChange={() => setVariantDefault(idx)}
                              disabled={submitting}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs text-muted-foreground">SKU (opt)</Label>
                          <input
                            type="text"
                            value={v.sku ?? ''}
                            onChange={e => updateVariantValue(idx, 'sku', e.target.value)}
                            disabled={submitting}
                            placeholder="Optional"
                            className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end">
                          <ImageUploadField
                            label=""
                            entityType="vendor"
                            entityId={vendorId}
                            intent="image"
                            value={v.image ?? ''}
                            onChange={url => updateVariantValue(idx, 'image', url)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasVariations && variants.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Product price shown on listing:{' '}
                  {formatPrice(Math.min(...variants.map(v => v.price)))} (minimum variant price)
                </p>
              )}
            </>
          )}

          <ImageUploadField
            label="Main product image"
            helperText={
              !hasVariations
                ? !vendorId
                  ? 'Loading vendor…'
                  : 'Upload a main image for this product.'
                : 'Main product image (variants can have their own images).'
            }
            entityType="vendor"
            entityId={vendorId}
            intent="image"
            value={formValues.imageUrl ?? ''}
            onChange={url => onChange('imageUrl', url)}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Supporting images (optional)</Label>
              {otherImages.length < MAX_OTHER_IMAGES && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOtherImage}
                  disabled={submitting}
                  className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add image
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Up to {MAX_OTHER_IMAGES} extra images. Main image is shown first.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherImages.map((url, idx) => (
                <Card key={idx} className="p-3 flex flex-col sm:flex-row gap-2 items-start">
                  <div className="flex-1 min-w-0 w-full">
                    <ImageUploadField
                      label={`Image ${idx + 1}`}
                      entityType="vendor"
                      entityId={vendorId}
                      intent="image"
                      value={url}
                      onChange={u => updateOtherImage(idx, u)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOtherImage(idx)}
                    disabled={submitting}
                    aria-label="Remove image"
                    className="shrink-0">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formValues.isFeatured ?? false}
              onChange={e => onChange('isFeatured', e.target.checked)}
              disabled={submitting}
              className="rounded border-input"
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Featured product
            </Label>
          </div>
          <div className="flex gap-2">
            <RegularBtn
              type="submit"
              variant="default"
              className="bg-primary hover:bg-primary/90"
              disabled={!canSubmit}
              loading={submitting}
              onDisabledClick={() => {
                const messages = getSubmitValidationMessages(
                  formValues,
                  formErrors,
                  hasVariations,
                  variationOptions,
                  variants
                );
                if (messages.length > 0) {
                  toast.error(messages.length === 1 ? messages[0] : messages.join('. '));
                } else if (submitting) {
                  toast.info('Please wait, creating product…');
                }
              }}>
              {submitting ? 'Creating…' : 'Create product'}
            </RegularBtn>
            <RegularBtn
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => router.push('/account/vendor/products')}>
              Cancel
            </RegularBtn>
          </div>
        </form>
      </Card>
    </div>
  );
}
