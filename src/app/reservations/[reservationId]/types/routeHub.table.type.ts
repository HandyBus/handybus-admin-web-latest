import { ReservationViewEntity } from '@/types/reservation.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ReservationViewEntity>();

export const columns = [
  columnHelper.accessor('fromDestinationShuttleRouteHubId', {
    header: () => '출발지 정보',
    cell: (info) => {
      const reservation = info.row.original;
      const hubId = info.getValue();

      if (!hubId) return '없음';

      const hub = reservation.shuttleRoute.fromDestinationShuttleRouteHubs.find(
        (hub) => hub.shuttleRouteHubId === hubId,
      );

      return hub?.name ?? '없음';
    },
  }),
  columnHelper.accessor('toDestinationShuttleRouteHubId', {
    header: () => '도착지 정보',
    cell: (info) => {
      const reservation = info.row.original;
      const hubId = info.getValue();

      if (!hubId) return '없음';

      const hub = reservation.shuttleRoute.toDestinationShuttleRouteHubs.find(
        (hub) => hub.shuttleRouteHubId === hubId,
      );

      return hub?.name ?? '없음';
    },
  }),
];
