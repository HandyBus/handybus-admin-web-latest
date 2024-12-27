'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { type BusType } from '@/types/bus.type';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<BusType>();

export const columns = [
  columnHelper.accessor('shuttleBusId', {
    header: () => 'ID',
    cell: (info) => info.getValue,
  }),
  columnHelper.accessor('type', {
    header: () => 'type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('phoneNumber', {
    header: () => '상태',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '액션',
    cell: (props) => (
      <BlueLink href={props.row.original.openChatLink}>
        오픈채팅 링크 열기
      </BlueLink>
    ),
  }),
];
