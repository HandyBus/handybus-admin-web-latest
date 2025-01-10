// 'use client';
import type { DailyShuttleType } from '@/types/v1/dailyShuttle.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<DailyShuttleType>();

export const columns = (shuttleId: number) => [
  columnHelper.accessor('dailyShuttleId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: () => '날짜',
    cell: (info) => info.getValue().toLocaleDateString('ko-KR'),
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
        href={`/events/${shuttleId}/dates/${props.row.original.dailyShuttleId}`}
      >
        자세히 보기
      </BlueLink>
    ),
  }),
];
