'use client';

import { authInstance } from '../config';
import {
  CouponListSchema,
  CreateCouponFormType,
  CreateCouponSchema,
} from '@/types/coupon.type';

export const addCoupon = async (request: CreateCouponFormType) => {
  return await authInstance.post(
    '/billing/admin/coupons',
    CreateCouponSchema.parse(request),
  );
};

export const getAllCoupons = async () => {
  const response = await authInstance.get<{ coupons: unknown }>(
    '/billing/admin/coupons',
  );
  return CouponListSchema.parse(response.coupons);
};
