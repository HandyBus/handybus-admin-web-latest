'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { ReservationViewEntity } from '@/types/reservation.type';

const columnHelper = createColumnHelper<ReservationViewEntity>();

export const columns = [
  columnHelper.accessor('reservationId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
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
  columnHelper.accessor('passengers', {
    id: 'passengersLength',
    header: () => '예약 인원',
    cell: (info) => info.getValue().length + '인',
  }),
  columnHelper.accessor('reservationStatus', {
    id: 'reservationStatus',
    header: () => '예약 상태',
    cell: (info) => Stringifier.reservationStatus(info.getValue()),
  }),
  columnHelper.accessor('cancelStatus', {
    id: 'cancelStatus',
    header: () => '환불 상태',
    cell: (info) => Stringifier.cancelStatus(info.getValue()),
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
          <span className="font-500 text-16">
            {reservation.shuttleRoute?.event?.eventName}
          </span>
          <br />
          <span className="font-400 text-grey-600 text-14">
            {date && new Date(date).toLocaleDateString()}
          </span>
          <br />
          <span className="font-500 text-grey-700 text-14">
            {reservation.shuttleRoute?.name}
          </span>
        </p>
      );
    },
  }),
  columnHelper.accessor('handyStatus', {
    id: 'handyStatus',
    header: '핸디 지원 유무',
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
      props.row.original.handyStatus === 'SUPPORTED' && (
        <>
          <BlueLink href={`/reservations/${props.row.original.reservationId}`}>
            승인하기
          </BlueLink>
          <BlueLink href={`/reservations/${props.row.original.reservationId}`}>
            거절하기
          </BlueLink>
        </>
      ),
  }),
  columnHelper.display({
    id: 'actions',
    header: '액션',
    cell: (props) => (
      <>
        <BlueLink
          href={`/reservations/${props.row.original.shuttleRouteId}/${props.row.original.reservationId}`}
        >
          상세보기
        </BlueLink>
      </>
    ),
  }),
];
