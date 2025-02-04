'use client';

import BlueLink from '@/components/link/BlueLink';
import { RegionHub } from '@/types/hub.type';
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
  columnHelper.accessor('address', {
    header: () => '주소',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('latitude', {
    header: () => '위도',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('longitude', {
    header: () => '경도',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => 'actions',
    cell: (info) => (
      <div className="gap-10 flex">
        <BlueLink
          href={`/hubs/${info.row.original.regionId}/${info.row.original.regionHubId}/edit`}
        >
          수정하기
        </BlueLink>
      </div>
    ),
  }),
];
