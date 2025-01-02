'use client';

import { ReservationType } from '@/types/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import dayjs from 'dayjs';

const columnHelper = createColumnHelper<ReservationType>();

export const columns = [
  columnHelper.accessor('reservationId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss'),
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
  columnHelper.display({
    id: 'shuttleRoute',
    header: () => '이용 노선',
    cell: (props) => {
      const reservation = props.row.original;
      // TODO
      return <span>노선 이름: {reservation.shuttleRoute?.name}</span>;
    },
  }),
  columnHelper.accessor('handyStatus', {
    header: () => '핸디 지원 유무',
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
    header: () => '핸디 승인',
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
    header: () => '액션',
    cell: (props) => (
      <>
        <BlueLink href={`/reservations/${props.row.original.reservationId}`}>
          상세보기
        </BlueLink>
      </>
    ),
  }),
];
