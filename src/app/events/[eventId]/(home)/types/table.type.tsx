import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { EventsView } from '@/types/v2/event.type';

const columnHelper =
  createColumnHelper<ArrayElement<EventsView['dailyEvents']>>();

export const columns = (eventId: number) => [
  columnHelper.accessor('dailyEventId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: () => '날짜',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: () => '상태',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '액션',
    cell: (props) => (
      <BlueLink
        href={`/events/${eventId}/dates/${props.row.original.dailyEventId}`}
      >
        자세히 보기
      </BlueLink>
    ),
  }),
];
