'use client';

import BlueLink from '@/components/link/BlueLink';
import { ID_TO_REGION } from '@/constants/regions';
import { RegionHub } from '@/types/hub.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<RegionHub>();

export const columns = [
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'tags',
    header: () => '태그',
    cell: (info) => {
      const eventDestination = info.row.original.eventDestination;
      const shuttleHub = info.row.original.shuttleHub;
      return (
        <div className="flex flex-col gap-4">
          {eventDestination && (
            <span className="py-2 rounded-xl bg-green-50 px-4 text-center text-14 font-500 text-green-500">
              행사장
            </span>
          )}
          {shuttleHub && (
            <span className="py-2 rounded-xl bg-blue-50 px-4 text-center text-14 font-500 text-blue-500">
              정류장
            </span>
          )}
        </div>
      );
    },
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
          href={`/locations/${info.row.original.regionId}/hubs/${info.row.original.regionHubId}/edit`}
        >
          수정하기
        </BlueLink>
      </div>
    ),
  }),
];
