import { ShuttleDemandStatisics } from '@/types/v2/demand.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ShuttleDemandStatisics>();

export const columnsFrom = [
  columnHelper.accessor('eventId', {
    id: 'eventId',
    header: '행사 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('dailyEventId', {
    id: 'dailyEventId',
    header: '행사 날짜 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('provinceFullName', {
    id: 'provinceFullName',
    header: '시/도',
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor('provinceShortName', {
  //   header: '...',
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor('cityFullName', {
    id: 'cityFullName',
    header: '시/군/구',
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor('cityShortName', {
  //   header: '...',
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor('toDestinationRegionHubName', {
    id: 'toDestinationRegionHubName',
    header: '목적지행 지역 거점지 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fromDestinationRegionHubName', {
    id: 'fromDestinationRegionHubName',
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
  columnHelper.accessor('toDestinationCount', {
    id: 'toDestinationCount',
    header: '목적지행 수요',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fromDestinationCount', {
    id: 'fromDestinationCount',
    header: '귀가행 수요',
    cell: (info) => info.getValue(),
  }),
];

export const columnsTo = [
  columnHelper.accessor('eventId', {
    id: 'eventId',
    header: '행사 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('dailyEventId', {
    id: 'dailyEventId',
    header: '행사 날짜 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('provinceFullName', {
    id: 'provinceFullName',
    header: '시/도',
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor('provinceShortName', {
  //   header: '...',
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor('cityFullName', {
    id: 'cityFullName',
    header: '시/군/구',
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor('cityShortName', {
  //   header: '...',
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor('toDestinationRegionHubName', {
    id: 'toDestinationRegionHubName',
    header: '목적지행 지역 거점지 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fromDestinationRegionHubName', {
    id: 'fromDestinationRegionHubName',
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
  columnHelper.accessor('toDestinationCount', {
    id: 'toDestinationCount',
    header: '목적지행 수요',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fromDestinationCount', {
    id: 'fromDestinationCount',
    header: '귀가행 수요',
    cell: (info) => info.getValue(),
  }),
];
