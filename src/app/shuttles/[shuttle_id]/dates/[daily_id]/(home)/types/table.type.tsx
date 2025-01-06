'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { type ShuttleRouteDetailType } from '@/types/v1/route.type';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<ShuttleRouteDetailType>();

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
        href={`/shuttles/${props.row.original.shuttleId}/dates/${props.row.original.dailyShuttleId}/routes/${props.row.original.shuttleRouteId}`}
      >
        자세히 보기
      </BlueLink>
    ),
  }),
];
