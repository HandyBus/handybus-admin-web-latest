'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';
import EditRouteStatusDialog from './EditRouteStatusDialog';
import BlueButton from '@/components/link/BlueButton';
import { sendShuttleInformation } from '@/services/shuttleRoute.service';
import { HANDY_PARTY_PREFIX } from '@/constants/common';

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
              ? 'text-basic-grey-600'
              : diff <= 5
                ? 'text-basic-red-600'
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
              ? 'text-basic-grey-600'
              : diff <= 5
                ? 'text-basic-red-600'
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
      <div className="flex flex-col items-center">
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
        <EditRouteStatusDialog shuttleRoute={props.row.original} />
      </div>
    ),
  }),
  columnHelper.display({
    id: 'statusAction',
    header: () => '탑승정보 알림톡 발송',
    cell: (props) => (
      <BlueButton
        onClick={async () => {
          try {
            const isConfirmed = confirm(
              `${props.row.original.name} 노선에 대해 탑승정보 알림톡을 발송하시겠습니까?`,
            );
            if (!isConfirmed) {
              return;
            }

            await sendShuttleInformation(
              props.row.original.eventId,
              props.row.original.dailyEventId,
              props.row.original.shuttleRouteId,
            );
            alert('탑승정보 알림톡 발송 완료');
          } catch (error) {
            console.error(error);
            alert('탑승정보 알림톡 발송 실패');
          }
        }}
        disabled={props.row.original.name.includes(HANDY_PARTY_PREFIX)}
      >
        알림톡 발송하기
      </BlueButton>
    ),
  }),
];
