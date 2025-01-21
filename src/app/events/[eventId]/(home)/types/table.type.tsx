import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { EventDailyShuttlesInEventsViewEntity } from '@/types/event.type';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';

const columnHelper =
  createColumnHelper<ArrayElement<EventDailyShuttlesInEventsViewEntity[]>>();

export const columns = (eventId: number) => [
  columnHelper.accessor('dailyEventId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: () => '날짜',
    cell: (info) => (
      <BlueLink
        href={`/events/${eventId}/dates/${info.row.original.dailyEventId}`}
      >
        {formatDateString(info.getValue())}
      </BlueLink>
    ),
  }),
  columnHelper.accessor('status', {
    header: () => '상태',
    cell: (info) => Stringifier.eventStatus(info.getValue()),
  }),
];
