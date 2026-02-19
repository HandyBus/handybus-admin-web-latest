import { RefundRequestType, RefundStatus } from '@/types/refund-request.type';
import { authInstance } from './config';
import { toSearchParamString } from '@/utils/searchParam.util';

import { RefundRequestReadModelSchema } from '@/types/refund-request.type';
import { withPagination } from '@/types/common.type';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import {
  CompleteRefundRequest,
  PaymentsViewEntitySchema,
} from '@/types/payment.type';
import { queryClient } from '@/components/Provider';
import { ReservationViewEntitySchema } from '@/types/reservation.type';
import { z } from 'zod';

export interface GetRefundRequestsOptions {
  paymentId: string | undefined;
  status: RefundStatus | undefined;
  type: RefundRequestType | undefined;
  isActive: boolean | undefined;
  orderBy: 'createdAt' | 'paymentId' | 'status' | 'type';
  additionalOrderOptions: 'ASC' | 'DESC';
}

interface GetRefundRequestsOptionsWithPagination
  extends GetRefundRequestsOptions {
  page: string | undefined;
  limit: number;
}

export const getRefundRequests = async (
  option?: Partial<GetRefundRequestsOptionsWithPagination>,
) => {
  const res = await authInstance.get(
    `/v1/billing/admin/payments/refunds/all${toSearchParamString({ ...option }, '?')}`,
    {
      shape: withPagination({
        items: z
          .object({
            refundRequest: RefundRequestReadModelSchema,
            payment: PaymentsViewEntitySchema,
            reservation: ReservationViewEntitySchema,
          })
          .array(),
      }),
    },
  );
  return res;
};

export const useGetRefundRequestsWithPagination = (
  option?: Partial<GetRefundRequestsOptionsWithPagination>,
) =>
  useInfiniteQuery({
    queryKey: ['refund-request', option],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getRefundRequests({ ...option, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });

export const postCompleteAutoRefundRequest = async (
  paymentId: string,
  refundRequestId: string,
  body: CompleteRefundRequest,
) => {
  return await authInstance.post(
    `/v1/billing/admin/payments/${paymentId}/refunds/${refundRequestId}/complete/auto`,
    body,
  );
};

export const usePostCompleteAutoRefundRequest = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: ({
      paymentId,
      refundRequestId,
      body,
    }: {
      paymentId: string;
      refundRequestId: string;
      body: CompleteRefundRequest;
    }) => postCompleteAutoRefundRequest(paymentId, refundRequestId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['refund-request'],
        refetchType: 'active',
      });
      onSuccess?.();
    },
  });
};

export const postCompleteManualRefundRequest = async (
  paymentId: string,
  refundRequestId: string,
  body: CompleteRefundRequest,
) => {
  return await authInstance.post(
    `/v1/billing/admin/payments/${paymentId}/refunds/${refundRequestId}/complete/manual`,
    body,
  );
};

export const usePostCompleteManualRefundRequest = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: ({
      paymentId,
      refundRequestId,
      body,
    }: {
      paymentId: string;
      refundRequestId: string;
      body: CompleteRefundRequest;
    }) => postCompleteManualRefundRequest(paymentId, refundRequestId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['refund-request'],
        refetchType: 'active',
      });
      onSuccess?.();
    },
  });
};
