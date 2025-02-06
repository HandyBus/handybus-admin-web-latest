'use client';

import { ID_TO_REGION } from '@/constants/regions';
import { RegionHub } from '@/types/hub.type';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';

const columnHelper = createColumnHelper<RegionHub>();

export const columns = [
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('regionId', {
    header: () => '지역',
    cell: (info) => {
      const regionId = info.getValue();
      const region = ID_TO_REGION[regionId];
      return region.bigRegion + ' ' + region.smallRegion;
    },
  }),
  columnHelper.accessor('address', {
    header: () => '주소',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '수정하기',
    cell: (info) => {
      const regionHubId = info.row.original.regionHubId;
      return <Link href={`/hubs/${regionHubId}/edit`}>수정하기</Link>;
    },
  }),
];
