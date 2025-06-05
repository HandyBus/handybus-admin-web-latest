import { useMutation } from '@tanstack/react-query';
import {
  AdminRequestRefundRequest,
  CompleteRefundRequest,
} from '@/types/refund.type';
import { authInstance } from './config';
import { z } from 'zod';
import { queryClient } from '@/components/Provider';

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
