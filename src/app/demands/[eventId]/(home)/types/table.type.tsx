import { ShuttleDemandStatistics } from '@/types/v2/demand.type';
import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import { toSearchParamString } from '@/utils/searchParam.util';

const columnHelper = createColumnHelper<ShuttleDemandStatistics>();

/**
 *
 */
export const columnGroupByCity = [
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
    id: 'actions1',
    header: '시/도 지역 수요',
    cell: (props) => (
      <>
        <BlueLink
          href={`/demands/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}${toSearchParamString({ provinceFullName: props.row.original.provinceFullName }, '?')}`}
        >
          {props.row.original.provinceFullName}
        </BlueLink>
      </>
    ),
  }),
  columnHelper.display({
    id: 'actions2',
    header: '시/군/구 지역 수요',
    cell: (props) => (
      <>
        <BlueLink
          href={`/demands/${props.row.original.eventId}/dates/${props.row.original.dailyEventId}${toSearchParamString({ provinceFullName: props.row.original.provinceFullName, cityFullName: props.row.original.cityFullName }, '?')}`}
        >
          {props.row.original.provinceFullName}{' '}
          {props.row.original.cityFullName}
        </BlueLink>
      </>
    ),
  }),
];
