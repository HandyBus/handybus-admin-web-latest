import { z } from 'zod';

export const PaymentSchema = z.object({
  paymentId: z.string().uuid(),
  principalAmount: z.number().int(),
  paymentAmount: z.number().int(),
  discountAmount: z.number().int(),
  couponDiscountAmount: z.number().int().nullable(),
  earlybirdDiscountAmount: z.number().int().nullable(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;

export const PaymentDetailSchema = z
  .object({
    refundRequests: z.array(z.unknown()),
    tossPayments: z.array(z.unknown()),
  })
  .merge(PaymentSchema);

export type PaymentDetailType = z.infer<typeof PaymentDetailSchema>;
