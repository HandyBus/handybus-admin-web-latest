'use client';

import BaseTable from './BaseTable';
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getFilteredRowModel,
  VisibilityState,
} from '@tanstack/react-table';

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnVisibility?: VisibilityState | undefined;
}

/**
 * @deprecated Use {@link BaseTable} instead.
 *
 * 정의된 columns 및 data를 이용하여 @tanstack/react-table을 표시합니다.
 * Columns and data should be defined in a stable reference to prevent infinite loop.
 *
 * @param columns
 * @param data
 * @returns ReactNode
 */
const DataTable = <TData,>({
  columns,
  data: dataSource,
  columnVisibility,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: Props<TData, any>) => {
  const [data] = useState([...dataSource]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    getFilteredRowModel: getFilteredRowModel(),
  });

  return <BaseTable table={table} />;
};

export default DataTable;
