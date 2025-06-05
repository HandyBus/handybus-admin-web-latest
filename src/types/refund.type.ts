import { z } from 'zod';

export const AdminRequestRefundRequestSchema = z.object({
  refundReason: z.string(),
  refundAmount: z.number(),
});

export type AdminRequestRefundRequest = z.infer<
  typeof AdminRequestRefundRequestSchema
>;

export const CompleteRefundRequestSchema = z.object({
  refundAmount: z.number(),
});

export type CompleteRefundRequest = z.infer<typeof CompleteRefundRequestSchema>;
