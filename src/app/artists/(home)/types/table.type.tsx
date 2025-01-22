'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArtistsViewEntity } from '@/types/artist.type';

const columnHelper = createColumnHelper<ArtistsViewEntity>();

export const columns = [
  columnHelper.accessor('artistId', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('artistName', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
];
