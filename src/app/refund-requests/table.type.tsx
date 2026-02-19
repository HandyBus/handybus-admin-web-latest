'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { RefundRequestReadModel } from '@/types/refund-request.type';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import RefundExecutionCapabilityCell from './components/RefundExecutionCapabilityCell';
import CompleteRefundCell from './components/CompleteRefundCell';

const columnHelper = createColumnHelper<RefundRequestReadModel>();

export const columns = [
  columnHelper.accessor('id', {
    header: () => '환불 요청 ID',
    cell: (info) => <span className="text-12">{info.getValue()}</span>,
  }),
  columnHelper.accessor('principalAmount', {
    header: () => '원금',
    cell: (info) => `${info.getValue().toLocaleString()}원`,
  }),
  columnHelper.accessor('refundAmount', {
    header: () => '환불 금액',
    cell: (info) => (
      <span className="font-500">{info.getValue().toLocaleString()}원</span>
    ),
  }),
  columnHelper.accessor('refundReason', {
    header: () => '환불 사유',
    cell: (info) => (
      <span className="block max-w-200 truncate" title={info.getValue()}>
        {info.getValue() || '-'}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: () => '상태',
    cell: (info) => {
      const status = Stringifier.refundStatus(info.getValue());
      const style = {
        '환불 요청': 'text-brand-primary-400',
        '환불 완료': 'text-basic-grey-700',
        '환불 거절': 'text-basic-red-500',
      };
      return (
        <b className={`${style[status]} whitespace-nowrap break-keep`}>
          {status}
        </b>
      );
    },
  }),
  columnHelper.accessor('type', {
    header: () => '유형',
    cell: (info) => (
      <span className="text-12">
        {Stringifier.refundRequestType(info.getValue())}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'refundExecutionCapability',
    header: () => '환불 실행 유형',
    cell: (info) => (
      <RefundExecutionCapabilityCell paymentId={info.row.original.paymentId} />
    ),
  }),
  columnHelper.accessor('refundAt', {
    header: () => '환불 일시',
    cell: (info) => formatDateString(info.getValue(), 'datetime') || '-',
  }),
  columnHelper.accessor('createdAt', {
    header: () => '요청일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.display({
    id: 'completeManualRefund',
    header: () => '액션',
    cell: (info) => <CompleteRefundCell refundRequest={info.row.original} />,
  }),
];
