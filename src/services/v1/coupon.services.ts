'use client';

import { authInstance } from '../config';
import {
  CouponListSchema,
  CreateCouponFormType,
  CreateCouponSchema,
} from '@/types/v1/coupon.type';

export const addCoupon = async (request: CreateCouponFormType) => {
  return await authInstance.post(
    '/v1/billing/admin/coupons',
    CreateCouponSchema.parse(request),
  );
};

export const getAllCoupons = async () => {
  const response = await authInstance.get<{ coupons: unknown }>(
    '/v1/billing/admin/coupons',
  );
  return CouponListSchema.parse(response.coupons);
};
