'use client';

import { type Table, flexRender } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
}

/**
 * 정의된 table을 이용하여 @tanstack/react-table을 표시합니다.
 *
 * @param table
 * @returns ReactNode
 */
const BaseTable = <TData,>({ table }: Props<TData>) => {
  return (
    <table className="text-16 border-separate border-spacing-y-4 text-left text-grey-900 rtl:text-right">
      <thead className="text-14 bg-grey-50 uppercase text-grey-700">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="rounded-lg bg-white">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className="border-y border-r border-grey-100 p-8 first:rounded-l-lg first:border-l last:rounded-r-lg transition-colors hover:bg-grey-100"
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
            className="border-spacing-y-40 rounded-lg border border-b border-grey-50 bg-white transition-colors hover:bg-grey-100"
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

export default BaseTable;
