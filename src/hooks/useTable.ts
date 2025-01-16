'use client';

import {
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

/**
 * {@link useReactTable}의 옵션을 받아서 기본 옵션을 적용해 반환합니다.
 *
 * @param option
 * @returns
 */
const useTable = <TData>(
  option: AllowUndefind<Omit<TableOptions<TData>, 'getCoreRowModel'>, 'data'>,
) => {
  const [empty] = useState<TData[]>([]);

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(option.initialState?.columnVisibility || {});

  const defaultOptions = {
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  } satisfies Omit<TableOptions<TData>, 'data' | 'columns' | 'getCoreRowModel'>;

  const newOption = {
    ...defaultOptions,
    ...option,
    data: option.data ?? empty,
    getCoreRowModel: getCoreRowModel(),
  };

  return useReactTable(newOption);
};

export default useTable;
