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
    <table className="border-separate border-spacing-y-4 text-left text-16 text-basic-grey-700 rtl:text-right">
      <tbody>
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header, headerIndex) => (
            <tr
              key={`${header.id}-${headerIndex}`}
              className="rounded-8 bg-basic-white"
            >
              <th className="rounded-l-lg w-1/3 border-y border-l border-basic-grey-100 bg-basic-grey-50 p-8 text-14 uppercase text-basic-grey-700">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
              <td className="rounded-r-lg border-y border-r border-basic-grey-100 p-8">
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
