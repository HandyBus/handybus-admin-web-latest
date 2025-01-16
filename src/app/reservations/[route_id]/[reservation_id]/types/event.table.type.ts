import { createColumnHelper } from '@tanstack/react-table';
import { ReservationView } from '@/types/v2/reservation.type';

const columnHelper = createColumnHelper<ReservationView>();

export const columns = [
  columnHelper.accessor('shuttleRoute.event.eventId', {
    header: () => '이벤트 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('shuttleRoute.event.eventName', {
    header: () => '이벤트 제목',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('shuttleRoute.event.eventLocationName', {
    header: () => '이벤트 장소',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('shuttleRoute.event.eventLocationAddress', {
    header: () => '이벤트 장소 주소',
    cell: (info) => info.getValue(),
  }),
];
