'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { RefundRequestReadModel } from '@/types/refund-request.type';
import { PaymentsViewEntity } from '@/types/payment.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import RefundExecutionCapabilityCell from './components/RefundExecutionCapabilityCell';
import CompleteRefundCell from './components/CompleteRefundCell';

export type RefundRequestTableRow = RefundRequestReadModel & {
  payment?: PaymentsViewEntity;
  reservation?: ReservationViewEntity;
};

const columnHelper = createColumnHelper<RefundRequestTableRow>();

export const columns = [
  columnHelper.display({
    id: 'info',
    header: () => '정보',
    cell: (info) => {
      const { id } = info.row.original;
      const reservation = info.row.original.reservation;
      const reservationName =
        reservation?.userName ?? reservation?.userNickname ?? '-';
      const phoneNumber = reservation?.userPhoneNumber ?? '-';
      return (
        <div className="flex flex-col gap-[2px]">
          <span className="text-14">
            이름: {reservationName} / 전화번호: {phoneNumber}
          </span>
          <span className="text-12 text-basic-grey-600">{id}</span>
        </div>
      );
    },
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
      <RefundExecutionCapabilityCell payment={info.row.original.payment} />
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
    id: 'actions',
    header: () => '액션',
    cell: (info) => (
      <CompleteRefundCell
        refundRequest={info.row.original}
        payment={info.row.original.payment}
      />
    ),
  }),
];
