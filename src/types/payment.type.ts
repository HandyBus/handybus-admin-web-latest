import { z } from 'zod';

export const PaymentSchema = z.object({
  paymentId: z.string().uuid(),
  principalAmount: z.number().int().nonnegative(),
  paymentAmount: z.number().int().nonnegative(),
  discountAmount: z.number().int().nonnegative(),
});
