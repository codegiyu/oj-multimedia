export function normalizeOptionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function normalizeEnumValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  defaultValue: T
): T {
  if (typeof value !== 'string') return defaultValue;
  const normalized = value.trim() as T;
  return allowedValues.includes(normalized) ? normalized : defaultValue;
}

export function requireText(value: string, fieldLabel: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldLabel} is required.`);
  }
  return trimmed;
}

export function normalizeOptionalHttpUrl(value: string, fieldLabel: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`${fieldLabel} must be a valid URL.`);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`${fieldLabel} must start with http:// or https://.`);
  }

  return trimmed;
}

/** Client-side mirror of backend monetization rule for admin/artist forms. */
export function assertMonetizationPriceClient(
  isMonetizable: boolean | undefined,
  price: number | undefined
): void {
  if (!isMonetizable) return;

  const numeric = typeof price === 'number' ? price : Number(price);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error('Price must be greater than 0 when premium download is enabled.');
  }
}

export function resolveMonetizationFormPrice(
  isMonetizable: boolean,
  price: number | undefined
): number {
  if (!isMonetizable) return 0;

  const numeric = typeof price === 'number' ? price : Number(price);

  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}
