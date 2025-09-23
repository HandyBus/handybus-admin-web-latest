'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import CancelReservationDialog from '@/app/reservations/components/CancelReservationDialog';
import RequestRefundDialog from '@/app/reservations/components/RequestRefundDialog';
import CancelHandyPartyButton from './components/CancelHandyPartyButton';

const busColumnHelper = createColumnHelper<ShuttleBusesViewEntity>();

export const busColumns = [
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
  reservationColumnHelper.display({
    id: 'user',
    header: () => '고객 정보',
    cell: (info) => {
      const userDesiredHubAddress =
        info.row.original.metadata?.desiredHubAddress;
      const userName = info.row.original.userName;
      const userNickname = info.row.original.userNickname;
      const userPhoneNumber = info.row.original.userPhoneNumber;

      const nameToUse = userName || userNickname || '탈퇴한 유저';
      const onlyHasNickname = !userName && !!userNickname;
      const withdrawnUser = !userName && !userNickname;

      return (
        <p>
          <span
            className={`text-16 font-500 ${withdrawnUser ? 'text-basic-grey-500' : onlyHasNickname ? 'text-basic-blue-400' : ''}`}
          >
            {nameToUse}
          </span>
          <br />
          <span className="text-14 font-400 text-basic-grey-600">
            ({userPhoneNumber || '전화번호 없음'})
          </span>
          <br />
          <span className="text-14 font-500 text-basic-grey-700">
            {userDesiredHubAddress &&
              '핸디팟 입력 주소: ' + userDesiredHubAddress}
          </span>
        </p>
      );
    },
  }),
  reservationColumnHelper.accessor('createdAt', {
    header: () => '예약일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  reservationColumnHelper.accessor('passengerCount', {
    header: () => '예약 인원',
    cell: (info) => info.getValue() + '인',
  }),
  reservationColumnHelper.accessor('reservationStatus', {
    header: () => '예약 상태',
    cell: (info) => {
      const reservationStatus = Stringifier.reservationStatus(info.getValue());
      const style = {
        미결제: 'text-basic-grey-500',
        '결제 완료': 'text-brand-primary-400',
        취소: 'text-basic-red-500',
      };
      return <b className={style[reservationStatus]}>{reservationStatus}</b>;
    },
  }),
  reservationColumnHelper.accessor('type', {
    id: 'type',
    header: () => '예약 유형',
    cell: (info) => Stringifier.tripType(info.getValue()),
  }),
  reservationColumnHelper.display({
    id: 'refundActions',
    header: () => '처리',
    cell: (info) => {
      const paymentId = info.row.original.paymentId;
      const reservation = info.row.original;
      if (!paymentId) {
        return null;
      }
      return (
        <div className="flex flex-col gap-4">
          <CancelReservationDialog
            reservationId={info.row.original.reservationId}
          />
          <RequestRefundDialog reservation={info.row.original} />
          <CancelHandyPartyButton reservation={reservation} />
        </div>
      );
    },
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
