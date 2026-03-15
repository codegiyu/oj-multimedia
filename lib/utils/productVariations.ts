/**
 * Product variation and variant utilities for vendor create/edit flows.
 * Cartesian product of option values, merge with existing variant data, single default.
 */

import type {
  IMarketplaceVariationOption,
  IMarketplaceProductVariant,
} from '@/lib/constants/endpoints';

/** Compute Cartesian product of variation option values → array of option combinations */
export function cartesianProduct(
  variationOptions: IMarketplaceVariationOption[]
): Record<string, string>[] {
  if (variationOptions.length === 0) return [];
  const [first, ...rest] = variationOptions;
  if (!first?.values?.length) return [];
  let combinations: Record<string, string>[] = first.values.map(value => ({ [first.name]: value }));
  for (const option of rest) {
    if (!option?.values?.length) continue;
    combinations = combinations.flatMap(combo =>
      option.values.map(value => ({ ...combo, [option.name]: value }))
    );
  }
  return combinations;
}

/** Compare two option records for equality (same keys and values) */
function optionsMatch(a: Record<string, string>, b: Record<string, string>): boolean {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;
  return keysA.every(k => a[k] === b[k]);
}

/**
 * Build full variant list from variation options, merging with existing variants.
 * Each combination gets price, inStock, sku, image from matching existing variant or defaults.
 * Exactly one variant has isDefault: true (preserve existing default if combination exists, else first).
 */
export function buildVariantsFromOptions(
  variationOptions: IMarketplaceVariationOption[],
  existingVariants: IMarketplaceProductVariant[] = [],
  defaultPrice: number = 0
): IMarketplaceProductVariant[] {
  const combinations = cartesianProduct(variationOptions);
  if (combinations.length === 0) return [];

  const existingDefault = existingVariants.find(v => v.isDefault);
  const hasExistingDefault =
    existingDefault && combinations.some(c => optionsMatch(c, existingDefault.options));

  return combinations.map((options, index) => {
    const existing = existingVariants.find(v => optionsMatch(v.options, options));
    const isFirst = index === 0;
    const isDefault = hasExistingDefault
      ? existingDefault != null && optionsMatch(options, existingDefault.options)
      : isFirst;

    return {
      options,
      price: existing?.price ?? defaultPrice,
      inStock: existing?.inStock ?? true,
      isDefault: !!isDefault,
      ...(existing?.sku != null && existing.sku !== '' && { sku: existing.sku }),
      ...(existing?.image != null && existing.image !== '' && { image: existing.image }),
    };
  });
}

/**
 * Set exactly one variant as default by index; all others isDefault false.
 * Returns new array with updated isDefault flags.
 */
export function setDefaultVariant(
  variants: IMarketplaceProductVariant[],
  defaultIndex: number
): IMarketplaceProductVariant[] {
  if (defaultIndex < 0 || defaultIndex >= variants.length) return variants;
  return variants.map((v, i) => ({
    ...v,
    isDefault: i === defaultIndex,
  }));
}

/**
 * Ensure exactly one variant has isDefault true (pick first if none).
 * Use before submit to satisfy backend.
 */
export function ensureSingleDefault(
  variants: IMarketplaceProductVariant[]
): IMarketplaceProductVariant[] {
  if (variants.length === 0) return [];
  const hasDefault = variants.some(v => v.isDefault);
  if (hasDefault) return variants;
  return variants.map((v, i) => ({ ...v, isDefault: i === 0 }));
}
