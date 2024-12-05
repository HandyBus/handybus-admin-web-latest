'use client';
import { HubType } from '@/types/region.type';
import { useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { getCoreRowModel } from '@tanstack/react-table';

interface Props {
  hubs: HubType[];
}

const HubsTable = ({ hubs }: Props) => {
  const [data] = useState([...hubs]);

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

export default HubsTable;

const columnHelper = createColumnHelper<HubType>();

const columns = [
  columnHelper.accessor('ID', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('regionID', {
    header: () => '지역 ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => '이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
];
