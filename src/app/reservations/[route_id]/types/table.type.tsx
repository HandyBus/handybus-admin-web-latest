'use client';

import { ReservationView } from '@/types/v2/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Stringifier from '@/utils/stringifier.util';
import { ShuttleBusesView } from '@/types/v2/shuttleBus.type';
import EditHandyStatusDialog from '../[reservation_id]/components/EditHandyStatusDialog';
import { formatDateString } from '@/utils/date.util';

const busColumnHelper = createColumnHelper<ShuttleBusesView>();

export const busColumns = [
  busColumnHelper.accessor('shuttleBusId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('busName', {
    header: () => '버스 이름',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('busNumber', {
    header: () => '버스 번호',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('busType', {
    header: () => '종류',
    cell: (info) => Stringifier.busType(info.getValue()),
  }),
  busColumnHelper.accessor('busCapacity', {
    header: () => '정원',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('busDriverPhoneNumber', {
    header: () => '기사님 연락처',
    cell: (info) => info.getValue(),
  }),
  busColumnHelper.accessor('openChatLink', {
    header: () => '오픈채팅 링크',
    cell: (info) => info.getValue(),
  }),
];

const reservationColumnHelper = createColumnHelper<ReservationView>();

export const reservationColumns = [
  reservationColumnHelper.accessor('reservationId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  reservationColumnHelper.display({
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
  reservationColumnHelper.accessor('createdAt', {
    header: () => '예약일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  reservationColumnHelper.accessor('passengers', {
    id: 'passengersLength',
    header: () => '예약 인원',
    cell: (info) => info.getValue().length + '인',
  }),
  reservationColumnHelper.accessor('type', {
    id: 'type',
    header: () => '예약 유형',
    cell: (info) => Stringifier.reservationType(info.getValue()),
  }),
  reservationColumnHelper.accessor('handyStatus', {
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
  reservationColumnHelper.display({
    id: 'handyActions',
    header: '핸디 승인',
    cell: (props) =>
      props.row.original.handyStatus !== 'NOT_SUPPORTED' && (
        <EditHandyStatusDialog response={props.row.original} />
      ),
  }),
  reservationColumnHelper.display({
    id: 'actions',
    header: '상세',
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
