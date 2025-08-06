import { createColumnHelper } from '@tanstack/react-table';
import { formatDateString } from '@/utils/date.util';
import { ReservationViewEntity } from '@/types/reservation.type';
import Stringifier from '@/utils/stringifier.util';
import dayjs from 'dayjs';
import BlueLink from '@/components/link/BlueLink';
import CancelReservationDialog from '@/app/reservations/components/CancelReservationDialog';
import RequestRefundDialog from '@/app/reservations/components/RequestRefundDialog';
import EditHandyStatusDialog from '@/components/dialog/EditHandyStatusDialog';

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
  columnHelper.display({
    id: 'user',
    header: () => '고객 정보',
    cell: (info) => {
      const userDesiredHubAddress =
        info.row.original.metadata?.desiredHubAddress;
      const userName = info.row.original.userName;
      const userNickname = info.row.original.userNickname;
      const userPhoneNumber = info.row.original.userPhoneNumber;

      return (
        <p>
          <span className="text-16 font-500">{userName ?? '-'}</span>
          <br />
          <span className="text-14 font-400 text-grey-600">
            {userNickname ? `(${userNickname})` : '탈퇴한 유저'}
          </span>
          <br />
          <span className="text-14 font-400 text-grey-600">
            ({userPhoneNumber || '전화번호 없음'})
          </span>
          <br />
          <span className="text-14 font-500 text-grey-700">
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
        미결제: 'text-grey-500',
        '결제 완료': 'text-green-500',
        취소: 'text-red-500',
      };
      return <b className={style[reservationStatus]}>{reservationStatus}</b>;
    },
  }),
  columnHelper.accessor('type', {
    id: 'type',
    header: () => '예약 유형',
    cell: (info) => Stringifier.tripType(info.getValue()),
  }),
  columnHelper.accessor('handyStatus', {
    id: 'handyStatus',
    header: '핸디 지원 여부',
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
  columnHelper.display({
    id: 'refundActions',
    header: () => '처리',
    cell: (info) => {
      const paymentId = info.row.original.paymentId;
      const showHandyActions =
        info.row.original.handyStatus !== 'NOT_SUPPORTED';
      if (!paymentId) {
        return null;
      }
      return (
        <div className="flex flex-col gap-4">
          <CancelReservationDialog
            reservationId={info.row.original.reservationId}
          />
          <RequestRefundDialog reservation={info.row.original} />
          <EditHandyStatusDialog
            response={info.row.original}
            disabled={!showHandyActions}
          />
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
