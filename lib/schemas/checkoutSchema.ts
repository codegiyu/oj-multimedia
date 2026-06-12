import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  address: z.string().trim().min(1, 'Delivery address is required'),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
