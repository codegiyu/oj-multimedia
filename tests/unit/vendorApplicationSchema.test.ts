import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const vendorApplicationSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeDescription: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

describe('vendorApplicationSchema', () => {
  it('accepts valid application payload', () => {
    const result = vendorApplicationSchema.safeParse({
      storeName: 'My Store',
      email: 'shop@example.com',
      phone: '+2348012345678',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing store name', () => {
    const result = vendorApplicationSchema.safeParse({
      storeName: '',
      email: 'shop@example.com',
      phone: '+2348012345678',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = vendorApplicationSchema.safeParse({
      storeName: 'My Store',
      email: 'not-an-email',
      phone: '+2348012345678',
    });

    expect(result.success).toBe(false);
  });
});
