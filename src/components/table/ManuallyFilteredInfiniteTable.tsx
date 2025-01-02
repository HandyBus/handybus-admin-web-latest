'use client';

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table';

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

/**
 * server-side filtering 및 infinite scroll을 지원하는 테이블을 표시합니다. {@link DataTable}의 advanced 버전입니다.
 * @see{@link DataTable}
 * @todo virtualization
 */
const ManuallyFilteredInfiniteTable = <TData,>({
  columns,
  data,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: Props<TData, any>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
  });

  return (
    <div className="w-full overflow-x-scroll">
      <table className="text-sm border-separate border-spacing-y-8 text-left text-grey-900 rtl:text-right">
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
    </div>
  );
};

export default ManuallyFilteredInfiniteTable;
