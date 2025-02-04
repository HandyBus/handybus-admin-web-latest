'use client';

import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import { ShuttleDemandsViewEntity } from '@/types/demand.type';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';

interface Props {
  demands: ShuttleDemandsViewEntity[];
}

const DemandsTable = ({ demands }: Props) => {
  const table = useTable({
    data: demands,
    columns,
  });

  return (
    <section className="flex w-full flex-col">
      <Heading.h2>수요조사 정보</Heading.h2>
      <BaseTable table={table} />
    </section>
  );
};

export default DemandsTable;
