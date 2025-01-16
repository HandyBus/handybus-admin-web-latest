import { createColumnHelper } from '@tanstack/react-table';
import { ShuttleRoutesView } from '@/types/v2/shuttleRoute.type';

const columnHelper = createColumnHelper<ShuttleRoutesView>();

export const columns = [
  columnHelper.accessor('shuttleRouteId', {
    header: () => '노선 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => '노선 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('dailyEventId', {
    header: () => '행사 일자',
    cell: (info) => {
      const route = info.row.original;
      const dailyEventId = info.getValue();

      const dailyEvent = route.event?.dailyEvents.find(
        (event) => event.dailyEventId === dailyEventId,
      );

      return dailyEvent ? dailyEvent.date : '-';
    },
  }),
  columnHelper.accessor('status', {
    header: () => '노선 상태',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('reservationDeadline', {
    header: () => '예약 마감일',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('earlybirdDeadline', {
    header: () => '얼리버드 예약 마감일',
    cell: (info) => info.getValue() ?? '-',
  }),
];
