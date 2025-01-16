import { ShuttleDemandStatisics } from '@/types/v2/demand.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';

const columnHelper = createColumnHelper<ShuttleDemandStatisics>();

export const columnsForGroupByEventId = [
  columnHelper.accessor('eventId', {
    id: 'eventId',
    header: '행사 ID',
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor('dailyEventId', {
  //   id: 'dailyEventId',
  //   header: '행사 날짜 ID',
  //   cell: (info) => info.getValue(),
  // }),
  // columnHelper.accessor('provinceFullName', {
  //   id: 'provinceFullName',
  //   header: '시/도',
  //   cell: (info) => info.getValue(),
  // }),
  // columnHelper.accessor('provinceShortName', {
  //   header: '시/도 축약',
  //   cell: (info) => info.getValue(),
  // }),
  // columnHelper.accessor('cityFullName', {
  //   id: 'cityFullName',
  //   header: '시/군/구',
  //   cell: (info) => info.getValue(),
  // }),
  // columnHelper.accessor('cityShortName', {
  //   header: '시/군/구 축약',
  //   cell: (info) => info.getValue(),
  // }),
  // columnHelper.accessor('toDestinationRegionHubName', {
  //   id: 'toDestinationRegionHubName',
  //   header: '목적지행 지역 거점지 이름',
  //   cell: (info) => info.getValue(),
  // }),
  // columnHelper.accessor('fromDestinationRegionHubName', {
  //   id: 'fromDestinationRegionHubName',
  //   header: '귀가행 지역 거점지 이름',
  //   cell: (info) => info.getValue(),
  // }),
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
  columnHelper.display({
    id: 'actions',
    header: '액션',
    cell: (props) => (
      <BlueLink href={`/demands/${props.row.original.eventId}`}>
        자세히 보기
      </BlueLink>
    ),
  }),
];
