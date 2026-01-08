'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';
import EditRouteStatusDialog from './EditRouteStatusDialog';
import dayjs from 'dayjs';
import { formatDateString } from '@/utils/date.util';

const columnHelper = createColumnHelper<AdminShuttleRoutesViewEntity>();

interface ShuttleRouteColumnsProps {
  selectedShuttleRoutes: AdminShuttleRoutesViewEntity[];
  onSelectShuttleRoute: (
    shuttleRoute: AdminShuttleRoutesViewEntity,
    isChecked: boolean,
  ) => void;
  onSelectAll: (isChecked: boolean) => void;
  alertRequestCounts: Record<string, number>;
}

export const getColumns = ({
  selectedShuttleRoutes,
  onSelectShuttleRoute,
  onSelectAll,
  alertRequestCounts,
}: ShuttleRouteColumnsProps) => [
  columnHelper.display({
    id: 'checkbox',
    header: ({ table }) => {
      const allRowShuttleRoutes = table
        .getRowModel()
        .rows.map((row) => row.original);
      const isAllSelected =
        selectedShuttleRoutes.length === allRowShuttleRoutes.length &&
        selectedShuttleRoutes.every((shuttleRoute) =>
          allRowShuttleRoutes.some(
            (r) => r.shuttleRouteId === shuttleRoute.shuttleRouteId,
          ),
        );
      const isSomeSelected =
        !isAllSelected &&
        selectedShuttleRoutes.some((shuttleRoute) =>
          allRowShuttleRoutes.some(
            (r) => r.shuttleRouteId === shuttleRoute.shuttleRouteId,
          ),
        );

      return (
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="m-auto h-20 w-20"
            checked={isAllSelected}
            ref={(el) => {
              if (el) {
                el.indeterminate = isSomeSelected;
              }
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
        </div>
      );
    },
    cell: (info) => {
      const shuttleRoute = info.row.original;
      const isSelected = selectedShuttleRoutes.some(
        (r) => r.shuttleRouteId === shuttleRoute.shuttleRouteId,
      );

      return (
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="m-auto h-20 w-20"
            checked={isSelected}
            onChange={(e) =>
              onSelectShuttleRoute(shuttleRoute, e.target.checked)
            }
          />
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'name',
    header: () => '이름',
    cell: (info) => {
      const { name, toDestinationShuttleRouteHubs } = info.row.original;
      const toDestinationDestinationHub = toDestinationShuttleRouteHubs?.find(
        (hub) => hub.role === 'DESTINATION',
      );
      const toDestinationArrivalTime = toDestinationDestinationHub?.arrivalTime
        ? dayjs(toDestinationDestinationHub.arrivalTime)
            .tz('Asia/Seoul')
            .format('HH:mm')
        : null;
      return (
        <div className="flex flex-col gap-[6px]">
          <span className="font-500">{name}</span>
          {toDestinationArrivalTime && (
            <span className="text-12 font-500 text-basic-grey-600">
              행사장행 {toDestinationArrivalTime} 도착
            </span>
          )}
        </div>
      );
    },
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
        isReservationDisabledToDestination,
        isReservationDisabledFromDestination,
        isReservationDisabledRoundTrip,
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
            <div
              className={`grid grid-cols-[1fr_55px_1fr] items-center ${isReservationDisabledRoundTrip ? 'opacity-30' : ''}`}
            >
              <span className="pr-16 text-right text-basic-grey-600">
                왕복:
              </span>
              <span className="text-12 font-500 text-basic-grey-600 line-through">
                {formattedRegularPriceRoundTrip}
              </span>
              <span className="font-500">
                {formattedEarlybirdPriceRoundTrip}
              </span>
            </div>
            <div
              className={`grid grid-cols-[1fr_55px_1fr] items-center ${isReservationDisabledToDestination ? 'opacity-30' : ''}`}
            >
              <span className="pr-16 text-right text-basic-grey-600">
                행사장행:
              </span>
              <span className="text-12 font-500 text-basic-grey-600 line-through">
                {formattedRegularPriceToDestination}
              </span>
              <span className="font-500">
                {formattedEarlybirdPriceToDestination}
              </span>
            </div>
            <div
              className={`grid grid-cols-[1fr_55px_1fr] items-center ${isReservationDisabledFromDestination ? 'opacity-30' : ''}`}
            >
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
          <span
            className={`text-right text-basic-grey-600 ${isReservationDisabledRoundTrip ? 'opacity-30' : ''}`}
          >
            왕복:
          </span>
          <span
            className={`font-500 ${isReservationDisabledRoundTrip ? 'opacity-30' : ''}`}
          >
            {formattedRegularPriceRoundTrip}
          </span>
          <span
            className={`text-right text-basic-grey-600 ${isReservationDisabledToDestination ? 'opacity-30' : ''}`}
          >
            행사장행:
          </span>
          <span
            className={`font-500 ${isReservationDisabledToDestination ? 'opacity-30' : ''}`}
          >
            {formattedRegularPriceToDestination}
          </span>
          <span
            className={`text-right text-basic-grey-600 ${isReservationDisabledFromDestination ? 'opacity-30' : ''}`}
          >
            귀가행:
          </span>
          <span
            className={`font-500 ${isReservationDisabledFromDestination ? 'opacity-30' : ''}`}
          >
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
