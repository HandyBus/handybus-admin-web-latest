import { z } from 'zod';

// ----- ENUM -----
export const RefundStatusEnum = z.enum(['REQUESTED', 'COMPLETED', 'FAILED']);
export type RefundStatus = z.infer<typeof RefundStatusEnum>;

export const RefundRequestTypeEnum = z.enum([
  'CANCEL', // 취소로 인한 환불, 자원 등 회수
  'ADMIN_ADJUSTMENT', // 관리자 조정으로 인한 환불, 자원 등 유지하며 특정 금액 환급, 이미 회수된 자원에도 추가 환불 가능
  'ADMIN_RETRIEVAL', // 관리자 회수로 인한 환불, 자원 등 회수, 이미 회수된 자원에도 추가 환불 가능
  'PAYBACK', // 자원 유지 + 보상금 형태로 특정 금액 환급
]);
export type RefundRequestType = z.infer<typeof RefundRequestTypeEnum>;

// ----- GET -----
export const RefundRequestReadModelSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  principalAmount: z.number(),
  previousRefundableAmount: z.number(),
  refundAmount: z.number(),
  afterRefundableAmount: z.number().nullable(),
  refundReason: z.string(),
  refundAt: z.string().nullable(),
  failedReason: z.string().nullable(),
  status: RefundStatusEnum,
  type: RefundRequestTypeEnum,
  processedByAdminId: z.string().nullable(),
  refundAccountNumber: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type RefundRequestReadModel = z.infer<
  typeof RefundRequestReadModelSchema
>;
