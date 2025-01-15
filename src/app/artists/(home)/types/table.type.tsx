'use client';

import { ArtistsView } from '@/types/v2/artist.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ArtistsView>();

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
