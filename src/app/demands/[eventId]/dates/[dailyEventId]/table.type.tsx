import { ShuttleDemandStatisticsReadModel } from '@/types/demand.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ShuttleDemandStatisticsReadModel>();

export const columnsFrom = [
  columnHelper.accessor('provinceFullName', {
    id: 'provinceFullName',
    header: '시/도',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cityFullName', {
    id: 'cityFullName',
    header: '시/군/구',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('regionHubName', {
    id: 'regionHubName',
    header: '귀가행 지역 거점지 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('totalCount', {
    id: 'totalCount',
    header: '총합',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('roundTripCount', {
    id: 'roundTripCount',
    header: '왕복 수요',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fromDestinationCount', {
    id: 'fromDestinationCount',
    header: '귀가행 수요',
    cell: (info) => info.getValue(),
  }),
];

export const columnsTo = [
  columnHelper.accessor('provinceFullName', {
    id: 'provinceFullName',
    header: '시/도',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cityFullName', {
    id: 'cityFullName',
    header: '시/군/구',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('regionHubName', {
    id: 'regionHubName',
    header: '목적지행 지역 거점지 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('totalCount', {
    id: 'totalCount',
    header: '총합',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('roundTripCount', {
    id: 'roundTripCount',
    header: '왕복 수요',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('toDestinationCount', {
    id: 'toDestinationCount',
    header: '목적지행 수요',
    cell: (info) => info.getValue(),
  }),
];
