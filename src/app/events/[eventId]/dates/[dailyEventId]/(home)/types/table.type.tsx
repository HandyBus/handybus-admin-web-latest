'use client';

import { createColumnHelper } from '@tanstack/react-table';
import type { ShuttleRoutesView } from '@/types/v2/shuttleRoute.type';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<ShuttleRoutesView>();

export const columns = [
  columnHelper.accessor('shuttleRouteId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => '이름',
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
        href={`/events/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}/routes/${props.row.original.shuttleRouteId}`}
      >
        자세히 보기
      </BlueLink>
    ),
  }),
];
