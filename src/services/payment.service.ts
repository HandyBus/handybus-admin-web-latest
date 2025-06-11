import {
  AdminRequestRefundRequest,
  CompleteRefundRequest,
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
import { queryClient } from '@/components/Provider';
import { z } from 'zod';

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

export const useGetUserPayment = (
  userId: string,
  paymentId: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: ['user', userId, 'payment', paymentId],
    queryFn: () => getUserPayment(userId, paymentId),
    enabled: options?.enabled,
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

export const postAdminRequestRefund = async (
  paymentId: string,
  body: AdminRequestRefundRequest,
) => {
  return await authInstance.post(
    `/v1/billing/admin/payments/${paymentId}/refunds`,
    body,
    {
      shape: {
        refundRequestId: z.string(),
      },
    },
  );
};

export const usePostAdminRequestRefund = () => {
  return useMutation({
    mutationFn: ({
      paymentId,
      body,
    }: {
      paymentId: string;
      body: AdminRequestRefundRequest;
    }) => postAdminRequestRefund(paymentId, body),
  });
};

export const postCompleteRefundRequest = async (
  paymentId: string,
  refundRequestId: string,
  body: CompleteRefundRequest,
) => {
  return await authInstance.post(
    `/v1/billing/admin/payments/${paymentId}/refunds/${refundRequestId}/complete`,
    body,
  );
};

export const usePostCompleteRefundRequest = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: ({
      paymentId,
      refundRequestId,
      body,
    }: {
      paymentId: string;
      refundRequestId: string;
      body: CompleteRefundRequest;
    }) => postCompleteRefundRequest(paymentId, refundRequestId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reservation'],
        refetchType: 'active',
      });
      onSuccess?.();
    },
  });
};
