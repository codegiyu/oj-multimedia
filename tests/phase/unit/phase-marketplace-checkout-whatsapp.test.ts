import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const checkoutFiles = [
  'components/section/marketplace/CheckoutPlaceOrderModal.tsx',
  'components/section/marketplace/CheckoutPageClient.tsx',
];

describe('marketplace checkout WhatsApp confirmation', () => {
  it.each(checkoutFiles)('%s wires modal-before-order flow', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');

    if (file.endsWith('CheckoutPlaceOrderModal.tsx')) {
      expect(source).toContain('Place order and continue on WhatsApp');
      expect(source).toContain('onConfirm');
    }

    if (file.endsWith('CheckoutPageClient.tsx')) {
      expect(source).toContain('CheckoutPlaceOrderModal');
      expect(source).toContain('setConfirmOpen(true)');
      expect(source).toContain('MARKETPLACE_PLACE_ORDER');
    }
  });
});
