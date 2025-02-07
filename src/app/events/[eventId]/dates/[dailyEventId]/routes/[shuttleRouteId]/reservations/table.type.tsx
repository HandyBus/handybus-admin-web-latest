'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import EditHandyStatusDialog from '@/components/dialog/EditHandyStatusDialog';

const busColumnHelper = createColumnHelper<ShuttleBusesViewEntity>();

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

const reservationColumnHelper = createColumnHelper<ReservationViewEntity>();

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
  reservationColumnHelper.accessor('passengerCount', {
    header: () => '예약 인원',
    cell: (info) => info.getValue() + '인',
  }),
  reservationColumnHelper.accessor('type', {
    id: 'type',
    header: () => '예약 유형',
    cell: (info) => Stringifier.tripType(info.getValue()),
  }),
  reservationColumnHelper.accessor('handyStatus', {
    id: 'handyStatus',
    header: '핸디 지원 유무',
    cell: (info) => {
      const handyStatus = Stringifier.handyStatus(info.getValue());
      const style = {
        승인됨: 'text-green-500',
        거절됨: 'text-red-500',
        미지원: 'text-grey-500',
        지원함: 'text-grey-900',
      };
      return <b className={style[handyStatus]}>{handyStatus}</b>;
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
        <BlueLink href={`/reservations/${props.row.original.reservationId}`}>
          상세보기
        </BlueLink>
      </>
    ),
  }),
];
