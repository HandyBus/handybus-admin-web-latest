'use client';

import { ReservationView } from '@/types/v2/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import dayjs from 'dayjs';
import Stringifier from '@/utils/stringifier.util';

const columnHelper = createColumnHelper<ReservationView>();

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
    cell: (info) => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss'),
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
  columnHelper.accessor('handyStatus', {
    id: 'handyStatus',
    header: '핸디 지원 유무',
    cell: (info) => {
      const handyStatus = Stringifier.handyStatus(info.getValue());
      switch (handyStatus) {
        case '승인됨':
          return <b className="text-green-500">승인됨</b>;
        case '거절됨':
          return <b className="text-red-500">거절됨</b>;
        case '지원하지 않음':
          return <b className="text-grey-500">미지원</b>;
        case '지원함':
          return <b className="text-grey-900">지원</b>;
      }
    },
  }),
  columnHelper.display({
    id: 'handyActions',
    header: '핸디 승인',
    cell: (props) =>
      props.row.original.handyStatus === 'SUPPORTED' && (
        <>
          <BlueLink
            href={`/reservations/${props.row.original.shuttleRouteId}/${props.row.original.reservationId}`}
          >
            승인하기
          </BlueLink>
          <BlueLink
            href={`/reservations/${props.row.original.shuttleRouteId}/${props.row.original.reservationId}`}
          >
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
