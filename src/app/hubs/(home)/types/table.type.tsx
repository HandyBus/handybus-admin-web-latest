'use client';

import { RegionHub } from '@/types/hub.type';
import { formatDateString } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<RegionHub>();

export const columns = [
  columnHelper.accessor('regionHubId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('regionId', {
    header: () => '지역 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
];
