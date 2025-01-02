import { z } from 'zod';

export const PaymentSchema = z.object({
  paymentId: z.string().uuid(),
  principalAmount: z.number().int().nonnegative(),
  paymentAmount: z.number().int().nonnegative(),
  discountAmount: z.number().int().nonpositive(),
  couponDiscountAmount: z.number().int().nonpositive().nullable(),
  earlybirdDiscountAmount: z.number().int().nonpositive().nullable(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;

export const PaymentDetailSchema = z
  .object({
    refundRequests: z.array(z.unknown()),
    tossPayments: z.array(z.unknown()),
  })
  .merge(PaymentSchema);

export type PaymentDetailType = z.infer<typeof PaymentDetailSchema>;
