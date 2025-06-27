import {
  PaymentsViewEntity,
  RefundRequestsInPaymentsViewEntity,
  TossPaymentsCancelsEntity,
  TossPaymentsCashReceiptsEntity,
  TossPaymentsEntity,
} from '@/types/payment.type';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<PaymentsViewEntity>();

export const paymentColumns = [
  columnHelper.accessor('paymentId', {
    header: '결제 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('principalAmount', {
    header: '원금',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('paymentAmount', {
    header: '결제 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('discountAmount', {
    header: '할인 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('couponDiscountAmount', {
    header: '쿠폰 할인',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('earlybirdDiscountAmount', {
    header: '얼리버드 할인',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('refundableAmount', {
    header: '환불 가능 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  columnHelper.accessor('issuedCouponId', {
    header: '발급된 쿠폰 ID',
    cell: (info) => info.getValue() ?? '없음',
  }),
  columnHelper.accessor('reservationId', {
    header: '예약 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.accessor('updatedAt', {
    header: '수정일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.accessor('refundRequests', {
    header: '환불 요청',
    cell: (info) =>
      info.getValue()?.length ? `${info.getValue()?.length}건` : '없음',
  }),
];

const refundRequestColumnHelper =
  createColumnHelper<RefundRequestsInPaymentsViewEntity>();

export const refundRequestColumns = [
  refundRequestColumnHelper.accessor('refundRequestId', {
    header: '환불 요청 ID',
    cell: (info) => info.getValue(),
  }),
  refundRequestColumnHelper.accessor('paymentId', {
    header: '결제 ID',
    cell: (info) => info.getValue(),
  }),
  refundRequestColumnHelper.accessor('principalAmount', {
    header: '원금',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  refundRequestColumnHelper.accessor('previousRefundableAmount', {
    header: '이전 환불 가능 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  refundRequestColumnHelper.accessor('refundAmount', {
    header: '환불 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  refundRequestColumnHelper.accessor('afterRefundableAmount', {
    header: '환불 후 환불 가능 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  refundRequestColumnHelper.accessor('refundReason', {
    header: '환불 사유',
    cell: (info) => info.getValue() || '-',
  }),
  refundRequestColumnHelper.accessor('refundAt', {
    header: '환불 일시',
    cell: (info) => (info.getValue() ? formatDateString(info.getValue()) : '-'),
  }),
  refundRequestColumnHelper.accessor('failedReason', {
    header: '실패 사유',
    cell: (info) => info.getValue() || '-',
  }),
  refundRequestColumnHelper.accessor('status', {
    header: '환불 상태',
    cell: (info) => Stringifier.refundStatus(info.getValue()),
  }),
  refundRequestColumnHelper.accessor('createdAt', {
    header: '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  refundRequestColumnHelper.accessor('updatedAt', {
    header: '수정일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
];

const tosspaymentsColumnHelper = createColumnHelper<TossPaymentsEntity>();

export const tosspaymentsColumns = [
  tosspaymentsColumnHelper.accessor('version', {
    header: 'Version',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('paymentKey', {
    header: 'Payment Key',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('orderId', {
    header: 'Order ID',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('orderName', {
    header: '주문명',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('mId', {
    header: 'mId',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('currency', {
    header: '통화',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('method', {
    header: '결제 수단',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('totalAmount', {
    header: '총 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsColumnHelper.accessor('balanceAmount', {
    header: '잔액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsColumnHelper.accessor('status', {
    header: '상태',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsColumnHelper.accessor('requestedAt', {
    header: '요청일시',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  tosspaymentsColumnHelper.accessor('approvedAt', {
    header: '승인일시',
    cell: (info) =>
      info.getValue() ? formatDateString(info.getValue(), 'datetime') : '없음',
  }),
  tosspaymentsColumnHelper.accessor('useEscrow', {
    header: '에스크로 사용 useEscrow',
    cell: (info) => (info.getValue() ? 'true' : 'false'),
  }),
  tosspaymentsColumnHelper.accessor('lastTransactionKey', {
    header: '마지막 거래 키 lastTransactionKey',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('suppliedAmount', {
    header: '공급가액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsColumnHelper.accessor('vat', {
    header: 'VAT',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsColumnHelper.accessor('cultureExpense', {
    header: '문화비 지출 여부 계좌이체, 가상계좌 결제에만 적용됨',
    cell: (info) => (info.getValue() ? 'true' : 'false'),
  }),
  tosspaymentsColumnHelper.accessor('isPartialCancelable', {
    header: '부분 취소 가능 여부',
    cell: (info) => (info.getValue() ? 'true' : 'false'),
  }),
  tosspaymentsColumnHelper.accessor('country', {
    header: '국가',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('secret', {
    header: '가상계좌 웹훅의 정상적인 요청 여부',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardAmount', {
    header: '카드 결제액',
    cell: (info) => info.getValue()?.toLocaleString() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardIssuerCode', {
    header: '카드 발급사 코드',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardAcquirerCode', {
    header: '카드 매입사 코드',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardNumber', {
    header: '카드번호',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardInstallmentPlanMonths', {
    header: '할부 개월',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardApproveNo', {
    header: '카드 승인번호',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardUseCardPoint', {
    header: '카드 포인트 사용 여부',
    cell: (info) => (info.getValue() ? 'true' : 'false'),
  }),
  tosspaymentsColumnHelper.accessor('cardType', {
    header: '카드 종류',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardOwnerType', {
    header: '카드 소유자 유형',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('failureCode', {
    header: '실패 코드',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardAcquireStatus', {
    header: '카드 매입 상태',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cardIsInterestFree', {
    header: '카드 무이자 할부 여부',
    cell: (info) => (info.getValue() ? 'true' : 'false'),
  }),
  tosspaymentsColumnHelper.accessor('cardInterestPayer', {
    header: '카드 수수료 부담자',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('failureCode', {
    header: '실패 코드',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('failureMessage', {
    header: '실패 메시지',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('discountAmount', {
    header: '할인 금액',
    cell: (info) => info.getValue()?.toLocaleString() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('mobilePhoneCustomerMobilePhone', {
    header: '결제에 사용한 휴대폰 번호',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('mobilePhoneSettlementStatus', {
    header: '휴대폰 결제 상태',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('mobilePhoneReceiptUrl', {
    header: '휴대폰 영수증 URL',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('giftCertificateApproveNo', {
    header: '기프트카드 승인번호',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('giftCertificateSettlementStatus', {
    header: '상품권 정산 상태',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('transferBankCode', {
    header: '계좌 이체 은행 코드',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('transferSettlementStatus', {
    header: '계좌 이체 정산 상태',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('receiptUrl', {
    header: '영수증 URL',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('checkoutUrl', {
    header: '결제창 URL',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('easyPayProvider', {
    header: '간편결제 제공사',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('easyPayAmount', {
    header: '간편결제 금액',
    cell: (info) => info.getValue()?.toLocaleString() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('easyPayDiscountAmount', {
    header: '간편결제 할인 금액',
    cell: (info) => info.getValue()?.toLocaleString() ?? '없음',
  }),
  tosspaymentsColumnHelper.accessor('cancels', {
    header: '취소 내역',
    cell: (info) =>
      info.getValue()?.length ? `${info.getValue()?.length}건` : '없음',
  }),
  tosspaymentsColumnHelper.accessor('cashReceipts', {
    header: '영수증 내역',
    cell: (info) =>
      info.getValue()?.length ? `${info.getValue()?.length}건` : '없음',
  }),
];

const tosspaymentsCancelColumnHelper =
  createColumnHelper<TossPaymentsCancelsEntity>();

export const tosspaymentsCancelColumns = [
  tosspaymentsCancelColumnHelper.accessor('cancelAmount', {
    header: '취소 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsCancelColumnHelper.accessor('cancelReason', {
    header: '취소 사유',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCancelColumnHelper.accessor('taxFreeAmount', {
    header: '세금 면제 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsCancelColumnHelper.accessor('taxExemptionAmount', {
    header: '세금 공제 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsCancelColumnHelper.accessor('refundableAmount', {
    header: '환불 가능 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsCancelColumnHelper.accessor('easyPayDiscountAmount', {
    header: '간편결제 할인 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsCancelColumnHelper.accessor('canceledAt', {
    header: '취소 일시',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCancelColumnHelper.accessor('transactionKey', {
    header: '거래 키',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCancelColumnHelper.accessor('receiptKey', {
    header: '영수증 키',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCancelColumnHelper.accessor('cancelStatus', {
    header: '취소 상태',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCancelColumnHelper.accessor('cancelRequestId', {
    header: '취소 요청 ID',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCancelColumnHelper.accessor('tossPaymentId', {
    header: '토스 결제 ID',
    cell: (info) => info.getValue() ?? '없음',
  }),
];

const tosspaymentsCashReceiptsColumnHelper =
  createColumnHelper<TossPaymentsCashReceiptsEntity>();

export const tosspaymentsCashReceiptsColumns = [
  tosspaymentsCashReceiptsColumnHelper.accessor('receiptKey', {
    header: '영수증 키',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('orderId', {
    header: '주문 ID',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('orderName', {
    header: '주문명',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('type', {
    header: '유형',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('issueNumber', {
    header: '발행번호',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('receiptUrl', {
    header: '영수증 URL',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('businessNumber', {
    header: '사업자 번호',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('transactionType', {
    header: '거래 유형',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('amount', {
    header: '금액',
    cell: (info) => info.getValue()?.toLocaleString() ?? '없음',
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('taxFreeAmount', {
    header: '세금 면제 금액',
    cell: (info) => info.getValue()?.toLocaleString(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('issueStatus', {
    header: '발행 상태',
    cell: (info) => info.getValue(),
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('failureCode', {
    header: '실패 코드',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('failureMessage', {
    header: '실패 메시지',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('customerIdentityNumber', {
    header: '고객 식별 번호',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('requestedAt', {
    header: '요청일시',
    cell: (info) => info.getValue() ?? '없음',
  }),
  tosspaymentsCashReceiptsColumnHelper.accessor('tossPaymentId', {
    header: '토스 결제 ID',
    cell: (info) => info.getValue() ?? '없음',
  }),
];
