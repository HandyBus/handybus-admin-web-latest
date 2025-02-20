'use client';

import { type Table, flexRender } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
}

/**
 * 정의된 table을 이용하여 @tanstack/react-table을 세로방향으로 표시합니다.
 * array 데이터의 경우 첫번째 요소만 표시합니다. 중첩된 데이터의 경우 BaseTable을 사용해주세요.
 *
 * @param table
 * @returns ReactNode
 */
const VerticalTable = <TData,>({ table }: Props<TData>) => {
  return (
    <table className="text-16 border-separate border-spacing-y-4 text-left text-grey-900 rtl:text-right">
      <tbody>
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header, headerIndex) => (
            <tr
              key={`${header.id}-${headerIndex}`}
              className="rounded-lg bg-white"
            >
              <th className="border-y border-l border-grey-100 p-8 rounded-l-lg bg-grey-50 text-grey-700 uppercase text-14 w-1/3">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
              <td className="border-y border-r border-grey-100 p-8 rounded-r-lg">
                {flexRender(
                  table.getRowModel().rows[0].getVisibleCells()[header.index]
                    .column.columnDef.cell,
                  table
                    .getRowModel()
                    .rows[0].getVisibleCells()
                    [header.index].getContext(),
                )}
              </td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
};

export default VerticalTable;
