'use client';

import { ReservationView } from '@/types/v2/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import dayjs from 'dayjs';
import Stringifier from '@/utils/stringifier.util';
import { ShuttleBusesView } from '@/types/v2/shuttleBus.type';

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
  busColumnHelper.accessor('handyUserId', {
    header: () => '핸디 유저 ID',
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
    header: () => '생성일',
    cell: (info) => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss'),
  }),
  reservationColumnHelper.accessor('reservationStatus', {
    id: 'reservationStatus',
    header: () => '예약 상태',
    cell: (info) => Stringifier.reservationStatus(info.getValue()),
  }),
  reservationColumnHelper.accessor('cancelStatus', {
    id: 'cancelStatus',
    header: () => '환불 상태',
    cell: (info) => Stringifier.cancelStatus(info.getValue()),
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
  reservationColumnHelper.display({
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
