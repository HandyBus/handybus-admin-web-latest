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

const RefundRequestsInPaymentsViewEntitySchema = z.object({
  refundRequestId: z.string(),
  paymentId: z.string(),
  principalAmount: z.number(),
  previousRefundableAmount: z.number(),
  refundAmount: z.number(),
  afterRefundableAmount: z.number().nullable(),
  refundReason: z.string(),
  refundAt: z.string().nullable(),
  failedReason: z.string(),
  status: RefundStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RefundRequestsInPaymentsViewEntity = z.infer<
  typeof RefundRequestsInPaymentsViewEntitySchema
>;

export const PaymentsViewEntitySchema = z.object({
  paymentId: z.string(),
  userId: z.string(),
  principalAmount: z.number(),
  paymentAmount: z.number(),
  discountAmount: z.number(),
  couponDiscountAmount: z.number(),
  earlybirdDiscountAmount: z.number(),
  cheerDiscountAmount: z.number(),
  cheerDiscountRate: z.number(),
  refundableAmount: z.number(),
  issuedCouponId: z.string().nullable(),
  cheerCampaignId: z.string().nullable(),
  referralId: z.string().nullable(),
  reservationId: z.string(),
  isConfirmed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  refundRequests: RefundRequestsInPaymentsViewEntitySchema.array().nullable(),
});
export type PaymentsViewEntity = z.infer<typeof PaymentsViewEntitySchema>;

export const TossPaymentsCancelsEntitySchema = z.array(
  z.object({
    cancelAmount: z.number(),
    cancelReason: z.string(),
    taxFreeAmount: z.number(),
    taxExemptionAmount: z.number(),
    refundableAmount: z.number(),
    easyPayDiscountAmount: z.number(),
    canceledAt: z.string(),
    transactionKey: z.string(),
    receiptKey: z.string(),
    cancelStatus: z.string(),
    cancelRequestId: z.string(),
    tossPaymentId: z.string(),
  }),
);
export type TossPaymentsCancelsEntity = z.infer<
  typeof TossPaymentsCancelsEntitySchema
>;

export const TossPaymentsCashReceiptsEntitySchema = z.array(
  z.object({
    receiptKey: z.string(),
    orderId: z.string(),
    orderName: z.string(),
    type: z.string(),
    issueNumber: z.string(),
    receiptUrl: z.string(),
    businessNumber: z.string(),
    transactionType: z.string(),
    amount: z.number(),
    taxFreeAmount: z.number(),
    issueStatus: z.string(),
    failureCode: z.string().nullable(),
    failureMessage: z.string().nullable(),
    customerIdentityNumber: z.string(),
    requestedAt: z.string(),
    tossPaymentId: z.string(),
  }),
);
export type TossPaymentsCashReceiptsEntity = z.infer<
  typeof TossPaymentsCashReceiptsEntitySchema
>;

export const TossPaymentsEntitySchema = z.object({
  version: z.string(),
  paymentKey: z.string(),
  type: z.string(),
  orderId: z.string(),
  orderName: z.string(),
  mId: z.string(),
  currency: z.string(),
  method: z.string().nullable(),
  totalAmount: z.number(),
  balanceAmount: z.number(),
  status: z.string(),
  requestedAt: z.string(),
  approvedAt: z.string().nullable(),
  useEscrow: z.boolean().nullable(),
  lastTransactionKey: z.string().nullable(),
  suppliedAmount: z.number(),
  vat: z.number(),
  cultureExpense: z.boolean(),
  isPartialCancelable: z.boolean(),
  country: z.string(),
  secret: z.string().nullable(),
  paymentId: z.string(),
  cardAmount: z.number().nullable(),
  cardIssuerCode: z.string().nullable(),
  cardAcquirerCode: z.string().nullable(),
  cardNumber: z.string().nullable(),
  cardInstallmentPlanMonths: z.number().nullable(),
  cardApproveNo: z.string().nullable(),
  cardUseCardPoint: z.boolean().nullable(),
  cardType: z.string().nullable(),
  cardOwnerType: z.string().nullable(),
  cardAcquireStatus: z.string().nullable(),
  cardIsInterestFree: z.boolean().nullable(),
  cardInterestPayer: z.string().nullable(),
  failureCode: z.string().nullable(),
  failureMessage: z.string().nullable(),
  discountAmount: z.number().nullable(),
  mobilePhoneCustomerMobilePhone: z.string().nullable(),
  mobilePhoneSettlementStatus: z.string().nullable(),
  mobilePhoneReceiptUrl: z.string().nullable(),
  giftCertificateApproveNo: z.string().nullable(),
  giftCertificateSettlementStatus: z.string().nullable(),
  transferBankCode: z.string().nullable(),
  transferSettlementStatus: z.string().nullable(),
  receiptUrl: z.string().nullable(),
  checkoutUrl: z.string().nullable(),
  easyPayProvider: z.string().nullable(),
  easyPayAmount: z.number().nullable(),
  easyPayDiscountAmount: z.number().nullable(),
  cancels: TossPaymentsCancelsEntitySchema.nullable(),
  cashReceipts: TossPaymentsCashReceiptsEntitySchema.nullable(),
});

export type TossPaymentsEntity = z.infer<typeof TossPaymentsEntitySchema>;

// ----- POST -----

export const AdminRequestRefundRequestSchema = z.object({
  refundReason: z.string(),
  refundAmount: z.number(),
  type: RefundRequestTypeEnum,
});

export type AdminRequestRefundRequest = z.infer<
  typeof AdminRequestRefundRequestSchema
>;

export const CompleteRefundRequestSchema = z.object({
  refundAmount: z.number(),
});

export type CompleteRefundRequest = z.infer<typeof CompleteRefundRequestSchema>;
