'use client';

import BlueLink from '@/components/link/BlueLink';
import { ID_TO_REGION } from '@/constants/regions';
import { RegionHubsViewEntity } from '@/types/hub.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<RegionHubsViewEntity>();

export const columns = [
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'tags',
    header: () => '태그',
    cell: (info) => {
      const eventLocation = info.row.original.eventLocation;
      const shuttleHub = info.row.original.shuttleHub;
      const eventParkingLot = info.row.original.eventParkingLot;
      const handyParty = info.row.original.handyParty;
      return (
        <div className="flex flex-col gap-4">
          {eventLocation && (
            <span className="bg-green-50 text-green-500 rounded-16 px-4 py-[2px] text-center text-14 font-500">
              행사장
            </span>
          )}
          {shuttleHub && (
            <span className="bg-basic-blue-50 rounded-16 px-4 py-[2px] text-center text-14 font-500 text-basic-blue-400">
              정류장
            </span>
          )}
          {eventParkingLot && (
            <span className="bg-basic-red-50 rounded-16 px-4 py-[2px] text-center text-14 font-500 text-basic-red-500">
              주차장
            </span>
          )}
          {handyParty && (
            <span className="rounded-16 border border-basic-grey-100 bg-basic-grey-50 px-4 py-[2px] text-center text-14 font-500">
              핸디팟
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
