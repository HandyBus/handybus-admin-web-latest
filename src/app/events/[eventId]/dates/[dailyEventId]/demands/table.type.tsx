import { ShuttleDemandStatisticsReadModel } from '@/types/demand.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ShuttleDemandStatisticsReadModel>();

export const columns = [
  columnHelper.accessor('regionHubName', {
    header: '정류장',
    cell: (info) => {
      const isCustom = Boolean(!info.row.original?.regionHubId);
      const name = info.getValue();
      return (
        <p className={`flex gap-12 ${isCustom && 'text-green-500'}`}>
          {isCustom && <span className="opacity-70">기타</span>}
          {name}
        </p>
      );
    },
  }),
  columnHelper.accessor('provinceFullName', {
    header: '시/도',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cityFullName', {
    header: '시/군/구',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('roundTripCount', {
    header: '왕복 수요',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('toDestinationCount', {
    header: '가는 편 수요',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fromDestinationCount', {
    header: '오는 편 수요',
    cell: (info) => info.getValue(),
  }),
];
