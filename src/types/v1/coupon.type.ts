import { z } from 'zod';

export const DISCOUNT_TYPES = ['RATE', 'AMOUNT'] as const;

export const CouponSchema = z.object({
  couponId: z.number().int(),
  code: z.string(),
  name: z.string(),
  discountType: z.enum(DISCOUNT_TYPES),
  discountRate: z.number().int(),
  discountAmount: z.number().int(),
  maxDiscountAmount: z.number().int(),
  maxApplicablePeople: z.number().int(),
  currentCouponUsage: z.number().int(),
  maxCouponUsage: z.number().int(),
  validFrom: z.string(),
  validTo: z.string(),
  isActive: z.boolean(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CouponListSchema = z.array(CouponSchema);

export type CouponType = z.infer<typeof CouponSchema>;

export const CreateCouponSchema = z.object({
  code: z.string(),
  name: z.string(),
  discountType: z.enum(DISCOUNT_TYPES),
  discountAmount: z.number().int().optional(),
  discountRate: z.number().int().min(0).max(100).optional(),
  maxDiscountAmount: z.number().int(),
  maxApplicablePeople: z.number().int(),
  maxCouponUsage: z.number().int(),
  validFrom: z.string(),
  validTo: z.string(),
});

export type CreateCouponFormType = z.infer<typeof CreateCouponSchema>;
