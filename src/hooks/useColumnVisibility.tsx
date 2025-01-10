'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, Columns3Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ColumnDef } from '@tanstack/react-table';
import Toggle from '@/components/button/Toggle';

/**
 * @deprecated Use {@link TableFilter} instead.
 */
const useColumnVisibility = <TData,>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[],
) => {
  const [visibility, setVisibility] = useState(
    Object.fromEntries(
      columns
        .map((c) => c.id)
        .filter((id) => id !== undefined)
        .map((id) => [id, true]),
    ),
  );

  const Filter = useCallback(
    ({ columnVisibility }: { columnVisibility: Record<string, boolean> }) => {
      return (
        <Disclosure>
          <DisclosureButton
            className={twMerge(
              'group flex w-fit items-center gap-2 justify-start gap-4 p-4 rounded-lg active:scale-90 hover:bg-grey-50 active:bg-grey-100 transition-all',
            )}
          >
            <Columns3Icon size={16} />열 선택
            <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="flex flex-row gap-4 flex-wrap">
            {columns.map((c) => {
              const id = c.id;
              if (id === undefined) return null;
              return (
                <Toggle
                  key={c.id}
                  value={columnVisibility[id]}
                  label={
                    (typeof c.header === 'string' ? c.header : undefined) || id
                  }
                  setValue={() => {
                    setVisibility((v) => ({ ...v, [id]: !v[id] }));
                  }}
                />
              );
            })}
          </DisclosurePanel>
        </Disclosure>
      );
    },
    [columns],
  );

  return [visibility, Filter] as const;
};

export default useColumnVisibility;
