import { describe, expect, it } from 'vitest';
import { checkoutSchema } from '@/lib/schemas/checkoutSchema';

describe('checkoutSchema', () => {
  const valid = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+2348012345678',
    address: '12 Market Street, Lagos',
    notes: 'Call before delivery',
  };

  it('accepts a valid checkout payload', () => {
    const result = checkoutSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('accepts empty optional notes', () => {
    const result = checkoutSchema.safeParse({ ...valid, notes: '' });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = checkoutSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = checkoutSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects missing phone', () => {
    const result = checkoutSchema.safeParse({ ...valid, phone: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing delivery address', () => {
    const result = checkoutSchema.safeParse({ ...valid, address: '' });
    expect(result.success).toBe(false);
  });
});
