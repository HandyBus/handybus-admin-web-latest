'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';
import {
  getShuttleRouteDemand,
  removeShuttleRouteDemand,
  setShuttleRouteDemand,
} from './routeDemand.util';

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
      const maxCount = info.row.original.maxPassengerCount;
      return (
        <span className={`${count === maxCount ? 'text-red-500' : ''}`}>
          ({count} / {maxCount})
        </span>
      );
    },
  }),
  columnHelper.accessor('fromDestinationCount', {
    header: () => '오는 편',
    cell: (info) => {
      const count = info.getValue();
      const maxCount = info.row.original.maxPassengerCount;
      return (
        <span className={`${count === maxCount ? 'text-red-500' : ''}`}>
          ({count} / {maxCount})
        </span>
      );
    },
  }),
  columnHelper.accessor('demandCount', {
    header: () => '추가 개설 요청',
    cell: (info) => {
      const value = info.getValue();
      const savedValue = getShuttleRouteDemand({
        eventId: info.row.original.eventId,
        dailyEventId: info.row.original.dailyEventId,
        shuttleRouteId: info.row.original.shuttleRouteId,
      });
      const handleSave = () => {
        setShuttleRouteDemand(savedValue ?? 0, {
          eventId: info.row.original.eventId,
          dailyEventId: info.row.original.dailyEventId,
          shuttleRouteId: info.row.original.shuttleRouteId,
        });
      };
      const handleRemove = () => {
        removeShuttleRouteDemand({
          eventId: info.row.original.eventId,
          dailyEventId: info.row.original.dailyEventId,
          shuttleRouteId: info.row.original.shuttleRouteId,
        });
      };
      return (
        <div className="group relative text-center">
          <p>
            {value}{' '}
            {savedValue !== null && (
              <span className="ml-[2px] text-12 text-grey-500">
                {savedValue}
              </span>
            )}
          </p>
          <div className="absolute -right-100 -top-8 hidden w-120 rounded-[4px] bg-black/70 p-8 text-grey-50 group-hover:block">
            {savedValue !== null ? (
              <p className="text-12">저장된 값: {savedValue}</p>
            ) : (
              <p className="text-12">저장된 값이 없습니다.</p>
            )}
            <section className="flex justify-center gap-4 text-12 text-grey-200 underline underline-offset-2">
              <button onClick={handleSave}>저장하기</button>
              <button onClick={handleRemove}>삭제하기</button>
            </section>
          </div>
        </div>
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
];
