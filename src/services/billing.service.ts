// ----- 조회 -----.

import {
  AdminCouponsResponseModelSchema,
  CreateCouponRequest,
  CreateCouponRequestSchema,
} from '@/types/coupon.type';
import { authInstance } from './config';
import { silentParse } from '@/utils/parse.util';
import { useMutation, useQuery } from '@tanstack/react-query';

// ----- 조회 -----

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

// ----- 명령 -----
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

// body에 refundAmount를 제공할 경우 원본 refundRequest의 refundAmount를 덮어씁니다
export const postCompleteRefundRequest = async (
  paymentId: number,
  refundRequestId: number,
  body?: {
    refundAmount?: number;
  },
) => {
  return await authInstance.post(
    `/v1/billing/admin/payments/${paymentId}/refunds/${refundRequestId}/complete`,
    body,
  );
};

export const usePostCompleteRefundRequest = () => {
  return useMutation({
    mutationFn: ({
      paymentId,
      refundRequestId,
      body,
    }: {
      paymentId: number;
      refundRequestId: number;
      body?: { refundAmount?: number };
    }) => postCompleteRefundRequest(paymentId, refundRequestId, body),
  });
};
