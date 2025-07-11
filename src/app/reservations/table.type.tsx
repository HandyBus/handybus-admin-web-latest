'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { ReservationViewEntity } from '@/types/reservation.type';
import EditHandyStatusDialog from '@/components/dialog/EditHandyStatusDialog';
import dayjs from 'dayjs';
import RequestRefundDialog from './components/RequestRefundDialog';
import CancelReservationDialog from './components/CancelReservationDialog';

const columnHelper = createColumnHelper<ReservationViewEntity>();

export const columns = [
  columnHelper.display({
    id: 'user',
    header: () => '고객 정보',
    cell: (props) => (
      <span>
        <span>{props.row.original.userNickname}</span>
        <br />
        <span>({props.row.original.userPhoneNumber || '전화번호 없음'})</span>
      </span>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.accessor('passengerCount', {
    id: 'passengerCount',
    header: () => '예약 인원',
    cell: (info) => info.getValue() + '인',
  }),
  columnHelper.accessor('reservationStatus', {
    id: 'reservationStatus',
    header: () => '예약 상태',
    cell: (info) => Stringifier.reservationStatus(info.getValue()),
  }),
  columnHelper.accessor('cancelStatus', {
    id: 'cancelStatus',
    header: () => '예약 취소 상태',
    cell: (info) => Stringifier.cancelStatus(info.getValue()),
  }),
  columnHelper.display({
    id: 'cancelActions',
    header: () => '예약 취소 상태 변경',
    cell: (info) => {
      const cancelStatus = info.row.original.cancelStatus;
      if (cancelStatus === 'CANCEL_COMPLETE') return null;
      return (
        <CancelReservationDialog
          reservationId={info.row.original.reservationId}
        />
      );
    },
  }),
  columnHelper.display({
    id: 'shuttleRoute',
    header: () => '이용 노선',
    cell: (props) => {
      const reservation = props.row.original;
      const date = reservation.shuttleRoute.event?.dailyEvents.find(
        (dailyEvent) =>
          dailyEvent.dailyEventId === reservation.shuttleRoute.dailyEventId,
      )?.date;
      return (
        <p>
          <span className="text-16 font-500">
            {reservation.shuttleRoute?.event?.eventName}
          </span>
          <br />
          <span className="text-14 font-400 text-grey-600">
            {date && dayjs(date).tz('Asia/Seoul').format('YYYY.MM.DD')}
          </span>
          <br />
          <span className="text-14 font-500 text-grey-700">
            {reservation.shuttleRoute?.name}
          </span>
        </p>
      );
    },
  }),
  columnHelper.accessor('handyStatus', {
    id: 'handyStatus',
    header: '핸디 지원 여부',
    cell: (info) => {
      switch (info.getValue()) {
        case 'ACCEPTED':
          return <b className="text-green-500">승인됨</b>;
        case 'DECLINED':
          return <b className="text-red-500">거절됨</b>;
        case 'NOT_SUPPORTED':
          return '지원하지 않음';
        case 'SUPPORTED':
          return <b>지원함</b>;
      }
    },
  }),
  columnHelper.display({
    id: 'handyActions',
    header: '핸디 승인',
    cell: (props) =>
      props.row.original.handyStatus !== 'NOT_SUPPORTED' && (
        <EditHandyStatusDialog response={props.row.original} />
      ),
  }),
  columnHelper.display({
    id: 'refundActions',
    header: () => '환불처리',
    cell: (info) => {
      const paymentId = info.row.original.paymentId;
      if (!paymentId) return null;
      return <RequestRefundDialog reservation={info.row.original} />;
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: '액션',
    cell: (props) => (
      <>
        <BlueLink href={`/reservations//${props.row.original.reservationId}`}>
          상세보기
        </BlueLink>
      </>
    ),
  }),
];
