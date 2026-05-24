'use client';

import { RegularInput } from '@/components/atoms/RegularInput';
import { Label } from '@/components/ui/label';

export interface MonetizationFormFieldsProps {
  idPrefix: string;
  isMonetizable: boolean;
  price: number;
  onMonetizableChange: (value: boolean) => void;
  onPriceChange: (value: number) => void;
  disabled?: boolean;
}

export function MonetizationFormFields({
  idPrefix,
  isMonetizable,
  price,
  onMonetizableChange,
  onPriceChange,
  disabled = false,
}: MonetizationFormFieldsProps) {
  const checkboxId = `${idPrefix}-is-monetizable`;
  const priceId = `${idPrefix}-price`;

  return (
    <div className="grid gap-3 rounded-md border border-border px-3 py-3 bg-muted/10">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          checked={isMonetizable}
          onChange={e => onMonetizableChange(e.target.checked)}
          disabled={disabled}
          className="mt-1 rounded border-input"
        />
        <div className="grid gap-1">
          <Label htmlFor={checkboxId} className="cursor-pointer font-medium">
            Premium download (paid)
          </Label>
          <p className="text-sm text-muted-foreground">
            When enabled, public users must purchase via WhatsApp before downloading. Requires a
            price greater than zero.
          </p>
        </div>
      </div>

      {isMonetizable && (
        <RegularInput
          id={priceId}
          label="Price (NGN)"
          type="number"
          min={1}
          step={1}
          value={price > 0 ? String(price) : ''}
          onChange={e => onPriceChange(parseFloat(e.target.value) || 0)}
          placeholder="e.g. 1500"
          required
          disabled={disabled}
        />
      )}
    </div>
  );
}
