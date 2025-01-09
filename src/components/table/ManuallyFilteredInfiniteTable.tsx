'use client';

import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table';
import BaseTable from './BaseTable';

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnVisibility?: VisibilityState | undefined;
}

/**
 * @deprecated Use {@link BaseTable} instead.
 *
 * server-side filtering 및 infinite scroll을 지원하는 테이블을 표시합니다.
 * @todo virtualization
 */
const ManuallyFilteredInfiniteTable = <TData,>({
  columns,
  data,
  columnVisibility,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: Props<TData, any>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    manualFiltering: true,
  });

  return <BaseTable table={table} />;
};

export default ManuallyFilteredInfiniteTable;
