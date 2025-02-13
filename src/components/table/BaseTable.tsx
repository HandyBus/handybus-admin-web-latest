import { type Table, flexRender } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';

interface Props<TData> {
  table: Table<TData>;
  cellClassName?: string;
  rowClassName?: string;
}

/**
 * 정의된 table을 이용하여 @tanstack/react-table을 표시합니다.
 *
 * @param table
 * @returns ReactNode
 */
const BaseTable = <TData,>({
  table,
  cellClassName,
  rowClassName,
}: Props<TData>) => {
  return (
    <table className="border-separate border-spacing-y-4 text-left text-16 text-grey-900 rtl:text-right">
      <thead className="whitespace-nowrap break-keep bg-grey-50 text-14 uppercase text-grey-700">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="rounded-lg bg-white">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className="border-y border-r border-grey-100 p-8 transition-colors first:rounded-l-lg first:border-l last:rounded-r-lg"
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
            className={twMerge(
              'border-spacing-y-40 rounded-lg border border-b border-grey-50 bg-white transition-colors',
              rowClassName,
            )}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={twMerge(
                  'border-y border-r border-grey-100 p-8 first:rounded-l-lg first:border-l last:rounded-r-lg',
                  cellClassName,
                )}
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
