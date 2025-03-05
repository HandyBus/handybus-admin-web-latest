import {
  AdminCouponsResponseModelSchema,
  CreateCouponRequest,
  CreateCouponRequestSchema,
  IssuedCouponsViewEntity,
} from '@/types/coupon.type';
import { authInstance } from './config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { silentParse } from '@/utils/parse.util';

// ----- GET -----

export const getCoupons = async () => {
  const res = await authInstance.get('/v1/billing/admin/coupons', {
    shape: { coupons: AdminCouponsResponseModelSchema.array() },
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
