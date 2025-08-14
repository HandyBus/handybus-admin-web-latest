import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, Columns3Icon } from 'lucide-react';
import Toggle from '../button/Toggle';
import { customTwMerge } from 'tailwind.config';
import { Column, Table } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
}

const ColumnFilter = <TData,>({ table }: Props<TData>) => {
  return (
    <Disclosure>
      <DisclosureButton
        className={customTwMerge(
          'gap-2 group flex w-fit items-center justify-start gap-4 rounded-8 p-4 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100',
        )}
      >
        <Columns3Icon size={16} />열 선택
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="flex flex-row flex-wrap gap-4">
        <Toggle
          value={table.getIsAllColumnsVisible()}
          label="모두 보기"
          onClick={table.getToggleAllColumnsVisibilityHandler()}
        />
        {table.getAllFlatColumns().map(renderColumnToggle)}
      </DisclosurePanel>
    </Disclosure>
  );
};

const renderColumnToggle = <TData,>(column: Column<TData, unknown>) => {
  const id = column.id;
  if (id === undefined) return null;
  const header = column.columnDef.header;

  if (column.getLeafColumns().length > 1) {
    const visibilityHandler = () => {
      const newState = !column.getIsVisible();
      column.getLeafColumns().forEach((c) => {
        c.toggleVisibility(newState);
      });
    };

    return (
      <Toggle
        disabled={!column.getCanHide()}
        key={column.id}
        value={column.getIsVisible()}
        label={'그룹 :' + (typeof header === 'string' ? header : column.id)}
        onClick={visibilityHandler}
      />
    );
  }

  return (
    <Toggle
      disabled={!column.getCanHide()}
      key={column.id}
      value={column.getIsVisible()}
      label={typeof header === 'string' ? header : column.id}
      onClick={column.getToggleVisibilityHandler()}
    />
  );
};

export default ColumnFilter;
