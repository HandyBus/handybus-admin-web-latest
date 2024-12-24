'use client';
import type { DailyShuttleType } from '@/types/dailyShuttle.type';
import { useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { getCoreRowModel } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';

interface Props {
  shuttleID: string;
  dailyShuttles: DailyShuttleType[];
}

const DailyShuttleTable = ({ shuttleID, dailyShuttles }: Props) => {
  const [data] = useState([...dailyShuttles]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('dailyShuttleId', {
        header: () => 'ID',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('date', {
        header: () => '날짜',
        cell: (info) => info.getValue().toLocaleDateString(),
      }),
      columnHelper.accessor('status', {
        header: () => '상태',
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => '액션',
        cell: (props) => (
          <BlueLink
            href={`/shuttles/${shuttleID}/dates/${props.row.original.dailyShuttleId}`}
          >
            자세히 보기
          </BlueLink>
        ),
      }),
    ],
    [shuttleID],
  );

  // Columns and data are defined in a stable reference, will not cause infinite loop!
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="text-sm w-full border-separate border-spacing-y-8 text-left text-grey-900 rtl:text-right">
      <thead className="text-xs bg-grey-50 uppercase text-grey-700">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="
          border-spacing-y-40 rounded-lg border border-b border-grey-50 bg-white transition-colors hover:bg-grey-50"
          >
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border-y border-r border-grey-100 p-8 first:rounded-l-lg first:border-l last:rounded-r-lg"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="border-spacing-y-40 rounded-lg border border-b border-grey-50 bg-white transition-colors hover:bg-grey-50"
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="border-y border-r border-grey-100 p-8 first:rounded-l-lg first:border-l last:rounded-r-lg"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DailyShuttleTable;

const columnHelper = createColumnHelper<DailyShuttleType>();
