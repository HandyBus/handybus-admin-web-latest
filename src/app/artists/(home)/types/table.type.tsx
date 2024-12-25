'use client';

import { ArtistType } from '@/types/artist.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ArtistType>();

export const columns = [
  columnHelper.accessor('artistId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
];
