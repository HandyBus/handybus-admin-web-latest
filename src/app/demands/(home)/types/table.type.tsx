import { ShuttleDemandStatisticsReadModel } from '@/types/demand.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Image from 'next/image';

const columnHelper = createColumnHelper<ShuttleDemandStatisticsReadModel>();

export const columnsForGroupByEventId = [
  // columnHelper.accessor('eventId', {
  //   id: 'eventId',
  //   header: '행사 ID',
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.display({
    id: 'image',
    header: '포스터',
    cell: (props) => (
      <Image
        src={props.row.original.eventImageUrl ?? ''}
        alt="포스터 이미지"
        width={80}
        height={110}
      />
    ),
  }),
  columnHelper.display({
    id: 'eventName',
    header: '행사 이름',
    cell: (info) => (
      <BlueLink href={`/events/${info.row.original.eventId}`}>
        {info.row.original.eventName}
      </BlueLink>
    ),
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
        이 행사의 일자별 수요 보기
      </BlueLink>
    ),
  }),
];
