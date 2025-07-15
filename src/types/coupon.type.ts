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
  issuedCouponId: z.string(),
  userId: z.string(),
  userNickname: z.string(),
  userProfileImage: z.string().nullable(),
  code: z.string(),
  name: z.string(),
  discountType: DiscountTypeEnum,
  discountRate: z.number().nullable(),
  discountAmount: z.number().nullable(),
  maxDiscountAmount: z.number().nullable(), // 비율 쿠폰 경우에는 적용됨
  maxApplicablePeople: z.number().nullable(), // 0일 경우에는 무제한
  validFrom: z.string(),
  validTo: z.string(),
  status: IssuedCouponStatusEnum,
});
export type IssuedCouponsViewEntity = z.infer<typeof IssuedCouponsViewEntity>;

export const AdminCouponsResponseModelSchema = z.object({
  couponId: z.string(),
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
  allowedEventId: z.string().nullable(),
  isActive: z.boolean(),
  status: ActiveStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AdminCouponsResponseModel = z.infer<
  typeof AdminCouponsResponseModelSchema
>;

// ----- POST -----

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
  allowedEventId: z.string().nullable(),
});
export type CreateCouponRequest = z.infer<typeof CreateCouponRequestSchema>;
