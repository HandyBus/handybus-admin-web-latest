// ----- 조회 -----.

import {
  AdminCouponsResponseModelSchema,
  CreateCouponRequest,
  CreateCouponRequestSchema,
} from '@/types/coupon.type';
import { authInstance } from './config';
import { silentParse } from '@/utils/parse.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  DashboardOptions,
  TotalSalesCountsReadModelSchema,
} from '@/types/dashboard.type';
import dayjs from 'dayjs';
import { toSearchParamString } from '@/utils/searchParam.util';

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

export const getTotalSalesCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 6,
  intervalDays = 1,
}: Partial<DashboardOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/billing/admin/payments/all/total-sales${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
      },
      '?',
    )}`,
    {
      shape: {
        totalSales: TotalSalesCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalSales;
};

export const useGetTotalSalesCounts = (options?: Partial<DashboardOptions>) => {
  return useQuery({
    queryKey: ['sales', 'count', options],
    queryFn: () => getTotalSalesCounts(options),
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
  paymentId: string,
  refundRequestId: string,
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
      paymentId: string;
      refundRequestId: string;
      body?: { refundAmount?: number };
    }) => postCompleteRefundRequest(paymentId, refundRequestId, body),
  });
};
