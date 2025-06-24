'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';
import EditRouteStatusDialog from './EditRouteStatusDialog';

const columnHelper = createColumnHelper<AdminShuttleRoutesViewEntity>();

export const columns = [
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: () => '상태',
    cell: (info) => Stringifier.shuttleRouteStatus(info.getValue()),
  }),
  columnHelper.accessor('toDestinationCount', {
    header: () => '가는 편',
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
              ? 'text-grey-600'
              : diff <= 5
                ? 'text-red-600'
                : 'text-green-500'
          }`}
        >
          ({count} / {maxCount})
        </span>
      );
    },
  }),
  columnHelper.accessor('fromDestinationCount', {
    header: () => '오는 편',
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
              ? 'text-grey-600'
              : diff <= 5
                ? 'text-red-600'
                : 'text-green-500'
          }`}
        >
          ({count} / {maxCount})
        </span>
      );
    },
  }),
  columnHelper.display({
    id: 'reservation-detail',
    header: () => '예약 상세',
    cell: (props) => (
      <BlueLink
        href={`/events/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}/routes/${props.row.original.shuttleRouteId}/reservations`}
      >
        예약 상세보기
      </BlueLink>
    ),
  }),
  columnHelper.display({
    id: 'route-detail',
    header: () => '노선 상세',
    cell: (props) => (
      <BlueLink
        href={`/events/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}/routes/${props.row.original.shuttleRouteId}`}
      >
        노선 상세보기
      </BlueLink>
    ),
  }),
  columnHelper.display({
    id: 'statusAction',
    header: () => '노선 상태 변경',
    cell: (props) => (
      <EditRouteStatusDialog shuttleRoute={props.row.original} />
    ),
  }),
];
