'use client';
import { HubType } from '@/types/v1/region.type';
import { formatDate } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<HubType>();

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
    cell: (info) => formatDate(info.getValue(), 'datetime'),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => formatDate(info.getValue(), 'datetime'),
  }),
];
