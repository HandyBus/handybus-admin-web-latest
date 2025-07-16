import {
  AdminCouponsResponseModelSchema,
  CreateCouponRequest,
  CreateCouponRequestSchema,
  IssuedCouponsViewEntity,
  UpdateCouponRequest,
  UpdateCouponRequestSchema,
} from '@/types/coupon.type';
import { authInstance } from './config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { silentParse } from '@/utils/parse.util';
import { withPagination } from '@/types/common.type';

// ----- GET -----

export const getCoupons = async () => {
  const res = await authInstance.get('/v1/billing/admin/coupons', {
    shape: withPagination({
      coupons: AdminCouponsResponseModelSchema.array(),
    }),
  });
  return res.coupons;
};

export const useGetCoupons = () => {
  return useQuery({
    queryKey: ['coupon'],
    queryFn: getCoupons,
    initialData: [],
  });
};

export const getCoupon = async (couponId: string) => {
  const res = await authInstance.get(`/v1/billing/admin/coupons/${couponId}`, {
    shape: {
      coupon: AdminCouponsResponseModelSchema,
    },
  });
  return res.coupon;
};

export const useGetCoupon = (couponId: string) => {
  return useQuery({
    queryKey: ['coupon', couponId],
    queryFn: () => getCoupon(couponId),
  });
};

export const getUserCoupons = async (userId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/coupons`,
    {
      shape: {
        issuedCoupons: IssuedCouponsViewEntity.array(),
      },
    },
  );
  return res.issuedCoupons;
};

export const useGetUserCoupons = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'coupon'],
    queryFn: () => getUserCoupons(userId),
  });
};

// ----- POST -----

export const postCoupon = async (body: CreateCouponRequest) => {
  return await authInstance.post(
    '/v1/billing/admin/coupons',
    silentParse(CreateCouponRequestSchema, body),
  );
};

export const usePostCoupon = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: postCoupon,
    onSuccess,
    onError,
  });
};

export const putCoupon = async (
  couponId: string,
  body: UpdateCouponRequest,
) => {
  return await authInstance.put(
    `/v1/billing/admin/coupons/${couponId}`,
    silentParse(UpdateCouponRequestSchema, body),
  );
};

export const usePutCoupon = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: ({
      couponId,
      body,
    }: {
      couponId: string;
      body: UpdateCouponRequest;
    }) => putCoupon(couponId, body),
    onSuccess,
    onError,
  });
};
