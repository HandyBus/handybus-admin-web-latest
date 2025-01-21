import { z } from 'zod';
import { ActiveStatusEnum } from './common.type';

// ----- ENUM -----

export const IssuedCouponStatusEnum = z.enum([
  'BEFORE_USE',
  'USED',
  'EXPIRED',
  'RETRIEVED',
  'DELETED',
]);
export type IssuedCouponStatus = z.infer<typeof IssuedCouponStatusEnum>;

export const DiscountTypeEnum = z.enum(['RATE', 'AMOUNT']);
export type DiscountType = z.infer<typeof DiscountTypeEnum>;

// ----- GET -----

export const IssuedCouponsViewEntity = z.object({
  issuedCouponId: z.number(),
  userId: z.number(),
  userNickname: z.string(),
  userProfileImage: z.string(),
  code: z.string(),
  name: z.string(),
  discountType: DiscountTypeEnum,
  discountRate: z.number().nullable(),
  discountAmount: z.number().nullable(),
  maxDiscountAmount: z.number().nullable(),
  maxApplicablePeople: z.number().nullable(),
  validFrom: z.string(),
  validTo: z.string(),
  status: IssuedCouponStatusEnum,
});
export type IssuedCouponsViewEntity = z.infer<typeof IssuedCouponsViewEntity>;

export const AdminCouponsResponseModelSchema = z.object({
  couponId: z.number(),
  code: z.string(),
  name: z.string(),
  discountType: DiscountTypeEnum,
  discountRate: z.number().int().nullable(),
  discountAmount: z.number().int().nullable(),
  maxDiscountAmount: z.number().int().nullable(),
  maxApplicablePeople: z.number().int(),
  currentCouponUsage: z.number().int(),
  maxCouponUsage: z.number().int(),
  validFrom: z.string(),
  validTo: z.string(),
  isActive: z.boolean(),
  status: ActiveStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AdminCouponsResponseModel = z.infer<
  typeof AdminCouponsResponseModelSchema
>;

// ----- POST & PUT -----

export const CreateCouponRequestSchema = z.object({
  code: z.string(),
  name: z.string(),
  discountType: DiscountTypeEnum,
  discountAmount: z.number().int().optional(),
  discountRate: z.number().int().min(0).max(100).optional(),
  maxDiscountAmount: z.number().int().optional(),
  maxApplicablePeople: z.number().int(),
  maxCouponUsage: z.number().int(),
  validFrom: z.string(),
  validTo: z.string(),
});
export type CreateCouponRequest = z.infer<typeof CreateCouponRequestSchema>;
