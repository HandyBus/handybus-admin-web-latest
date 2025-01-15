'use client';

import { silentParse } from '@/utils/parse.util';
import { authInstance } from '../config';
import {
  CouponListSchema,
  CreateCouponFormType,
  CreateCouponSchema,
} from '@/types/v1/coupon.type';

// TODO : v2 api가 준비되면 migrate
export const addCoupon = async (request: CreateCouponFormType) => {
  return await authInstance.post(
    '/v1/billing/admin/coupons',
    silentParse(CreateCouponSchema, request),
  );
};

// TODO : v2 api가 준비되면 migrate
export const getAllCoupons = async () => {
  const response = await authInstance.get('/v1/billing/admin/coupons', {
    shape: { coupons: CouponListSchema },
  });
  return response.coupons;
};
