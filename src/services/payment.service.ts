import {
  PaymentsViewEntitySchema,
  TossPaymentsEntitySchema,
} from '@/types/payment.type';
import { authInstance } from './config';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  DashboardOptions,
  TotalSalesCountsReadModelSchema,
} from '@/types/dashboard.type';
import { toSearchParamString } from '@/utils/searchParam.util';

// ----- GET -----

export const getUserPayment = async (userId: string, paymentId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/payments/${paymentId}`,
    {
      shape: {
        payments: PaymentsViewEntitySchema.nullable(),
        tossPayments: TossPaymentsEntitySchema.nullable(),
      },
    },
  );
  return res;
};

export const useGetUserPayment = (userId: string, paymentId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'payment', paymentId],
    queryFn: () => getUserPayment(userId, paymentId),
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

// ----- POST -----

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
