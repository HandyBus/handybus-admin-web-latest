'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { ReservationViewEntity } from '@/types/reservation.type';
import dayjs from 'dayjs';
import RequestRefundDialog from './components/RequestRefundDialog';
import CancelReservationDialog from './components/CancelReservationDialog';

const columnHelper = createColumnHelper<ReservationViewEntity>();

export const columns = [
  columnHelper.display({
    id: 'shuttleRoute',
    header: () => '이용 노선',
    cell: (info) => {
      const reservation = info.row.original;
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
          <span className="text-14 font-400 text-basic-grey-600">
            {date && dayjs(date).tz('Asia/Seoul').format('YYYY.MM.DD')}
          </span>
          <br />
          <span className="text-14 font-500 text-basic-grey-700">
            {reservation.shuttleRoute?.name}
          </span>
        </p>
      );
    },
  }),
  columnHelper.display({
    id: 'user',
    header: () => '고객 정보',
    cell: (info) => {
      const userDesiredHubAddress =
        info.row.original.metadata?.desiredHubAddress;
      const userPhoneNumber = info.row.original.userPhoneNumber;
      const userName = info.row.original.userName;
      const userNickname = info.row.original.userNickname;

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
  columnHelper.accessor('createdAt', {
    header: () => '예약일',
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
  columnHelper.accessor('type', {
    id: 'type',
    header: () => '예약 유형',
    cell: (info) => Stringifier.tripType(info.getValue()),
  }),
  columnHelper.display({
    id: 'refundActions',
    header: () => '처리',
    cell: (info) => {
      const paymentId = info.row.original.paymentId;
      if (!paymentId) {
        return null;
      }
      return (
        <div className="flex flex-col gap-4">
          <CancelReservationDialog
            reservationId={info.row.original.reservationId}
          />
          <RequestRefundDialog reservation={info.row.original} />
        </div>
      );
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
