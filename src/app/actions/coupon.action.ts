'use server';

import { instance } from '@/services/config';
import {
  CouponListSchema,
  CouponType,
  CreateCouponSchema,
} from '@/types/coupon.type';

export const addCoupon = async (request: CouponType) => {
  CreateCouponSchema.parse(request);
  const response = await instance.post('/billing/admin/coupons', request);
  return response.data;
};

export const getAllCoupons = async () => {
  const response = await instance.get('/billing/admin/coupons');
  return CouponListSchema.parse(response.data.coupons);
};
