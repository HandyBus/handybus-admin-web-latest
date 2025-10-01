'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';
import EditRouteStatusDialog from './EditRouteStatusDialog';
import dayjs from 'dayjs';
import { formatDateString } from '@/utils/date.util';

const columnHelper = createColumnHelper<AdminShuttleRoutesViewEntity>();

export const getColumns = (alertRequestCounts: Record<string, number>) => [
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'status',
    header: () => '상태',
    cell: (info) => {
      const { status, reservationDeadline } = info.row.original;
      const statusText = Stringifier.shuttleRouteStatus(status);
      const style = {
        '예약 모집 중': 'text-brand-primary-400',
        '예약 마감': 'text-basic-grey-700',
        '운행 종료': 'text-basic-grey-500',
        무산: 'text-basic-red-500',
        비활성: 'text-basic-grey-500',
      };
      return (
        <div className="flex flex-col items-center gap-[6px]">
          <span className={`${style[statusText]} font-500`}>{statusText}</span>
          <span className="text-12 font-500 text-basic-grey-600">
            {reservationDeadline &&
              ` ~ ${formatDateString(reservationDeadline, 'date')}`}
          </span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'price',
    header: () => '가격',
    cell: (info) => {
      const {
        regularPriceToDestination,
        regularPriceFromDestination,
        regularPriceRoundTrip,
        earlybirdPriceRoundTrip,
        earlybirdPriceToDestination,
        earlybirdPriceFromDestination,
        hasEarlybird,
        earlybirdDeadline,
      } = info.row.original;

      const formattedRegularPriceToDestination = regularPriceToDestination
        ? `${regularPriceToDestination.toLocaleString()}원`
        : '-';
      const formattedRegularPriceFromDestination = regularPriceFromDestination
        ? `${regularPriceFromDestination.toLocaleString()}원`
        : '-';
      const formattedRegularPriceRoundTrip = regularPriceRoundTrip
        ? `${regularPriceRoundTrip.toLocaleString()}원`
        : '-';
      const formattedEarlybirdPriceRoundTrip = earlybirdPriceRoundTrip
        ? `${earlybirdPriceRoundTrip.toLocaleString()}원`
        : '-';
      const formattedEarlybirdPriceToDestination = earlybirdPriceToDestination
        ? `${earlybirdPriceToDestination.toLocaleString()}원`
        : '-';
      const formattedEarlybirdPriceFromDestination =
        earlybirdPriceFromDestination
          ? `${earlybirdPriceFromDestination.toLocaleString()}원`
          : '-';

      const isEarlybirdPeriod =
        hasEarlybird && dayjs().isBefore(earlybirdDeadline);

      if (isEarlybirdPeriod) {
        return (
          <div className="flex flex-col gap-[6px]">
            <div className="grid grid-cols-[1fr_55px_1fr] items-center">
              <span className="pr-16 text-right text-basic-grey-600">
                왕복:
              </span>
              <span className="text-12 font-500 text-basic-grey-600 line-through">
                {formattedRegularPriceRoundTrip}
              </span>
              <span className="font-500">
                {formattedEarlybirdPriceRoundTrip}
              </span>
              <span className="pr-16 text-right text-basic-grey-600">
                행사장행:
              </span>
              <span className="text-12 font-500 text-basic-grey-600 line-through">
                {formattedRegularPriceToDestination}
              </span>
              <span className="font-500">
                {formattedEarlybirdPriceToDestination}
              </span>
              <span className="pr-16 text-right text-basic-grey-600">
                귀가행:
              </span>
              <span className="text-12 font-500 text-basic-grey-600 line-through">
                {formattedRegularPriceFromDestination}
              </span>
              <span className="font-500">
                {formattedEarlybirdPriceFromDestination}
              </span>
            </div>
            <span className="text-center text-12 font-500 text-basic-grey-600">
              얼리버드 진행 중 ~{formatDateString(earlybirdDeadline, 'date')}
            </span>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-2 items-center gap-x-16">
          <span className="text-right text-basic-grey-600">왕복:</span>
          <span className="font-500">{formattedRegularPriceRoundTrip}</span>
          <span className="text-right text-basic-grey-600">행사장행:</span>
          <span className="font-500">{formattedRegularPriceToDestination}</span>
          <span className="text-right text-basic-grey-600">귀가행:</span>
          <span className="font-500">
            {formattedRegularPriceFromDestination}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor('toDestinationCount', {
    header: () => '행사장행',
    cell: (info) => {
      const count = info.getValue();
      if (count === null) {
        return '-';
      }
      const maxCount = info.row.original.maxPassengerCount;
      const diff = maxCount - count;
      return (
        <span
          className={`${
            diff === 0
              ? 'text-basic-grey-600'
              : diff <= 5
                ? 'text-basic-red-500'
                : 'text-brand-primary-400'
          }`}
        >
          ({count} / {maxCount})
        </span>
      );
    },
  }),
  columnHelper.accessor('fromDestinationCount', {
    header: () => '귀가행',
    cell: (info) => {
      const count = info.getValue();
      if (count === null) {
        return '-';
      }
      const maxCount = info.row.original.maxPassengerCount;
      const diff = maxCount - count;
      return (
        <span
          className={`${
            diff === 0
              ? 'text-basic-grey-600'
              : diff <= 5
                ? 'text-basic-red-500'
                : 'text-brand-primary-400'
          }`}
        >
          ({count} / {maxCount})
        </span>
      );
    },
  }),
  columnHelper.display({
    id: 'empty-seat-request-count',
    header: () => '빈자리 알림 요청수',
    cell: (props) => {
      const id = props.row.original.shuttleRouteId;
      const count = alertRequestCounts[id] ?? 0;
      return <span>{count}</span>;
    },
  }),
  columnHelper.display({
    id: 'route-detail',
    header: () => '상세',
    cell: (props) => (
      <div className="flex flex-col items-center">
        <BlueLink
          href={`/events/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}/routes/${props.row.original.shuttleRouteId}/reservations`}
        >
          예약 상세보기
        </BlueLink>
        <BlueLink
          href={`/events/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}/routes/${props.row.original.shuttleRouteId}`}
        >
          노선 상세보기
        </BlueLink>
        <BlueLink
          href={`/events/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}/routes/${props.row.original.shuttleRouteId}/edit`}
        >
          노선 수정하기
        </BlueLink>
      </div>
    ),
  }),
  columnHelper.display({
    id: 'statusAction',
    header: () => '액션',
    cell: (props) => (
      <div className="flex flex-col items-center">
        <EditRouteStatusDialog shuttleRoute={props.row.original} />
      </div>
    ),
  }),
];
