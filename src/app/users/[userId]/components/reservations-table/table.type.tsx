import { createColumnHelper } from '@tanstack/react-table';
import { formatDateString } from '@/utils/date.util';
import { ReservationViewEntity } from '@/types/reservation.type';
import Stringifier from '@/utils/stringifier.util';
import { dayjsTz } from '@/utils/date.util';

const columnHelper = createColumnHelper<ReservationViewEntity>();

export const columns = [
  columnHelper.accessor('createdAt', {
    header: '예약 일시',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
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
            {date && dayjsTz(date).toLocaleDateString()}
          </span>
          <br />
          <span className="text-14 font-500 text-grey-700">
            {reservation.shuttleRoute?.name}
          </span>
        </p>
      );
    },
  }),
  columnHelper.accessor('passengerCount', {
    header: '인원수',
    cell: (info) => info.getValue() + '인',
  }),
  columnHelper.accessor('type', {
    header: '유형',
    cell: (info) => Stringifier.tripType(info.getValue()),
  }),
  columnHelper.accessor('paymentPrincipalAmount', {
    header: '원금',
    cell: (info) => info.getValue() + '원',
  }),
  columnHelper.accessor('paymentDiscountAmount', {
    header: '할인 금액',
    cell: (info) => info.getValue() + '원',
  }),
  columnHelper.accessor('paymentAmount', {
    header: '결제 금액',
    cell: (info) => info.getValue() + '원',
  }),
  columnHelper.accessor('handyStatus', {
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
];
