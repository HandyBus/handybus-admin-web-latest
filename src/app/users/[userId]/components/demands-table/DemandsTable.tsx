'use client';

import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import { ShuttleDemandsViewEntity } from '@/types/demand.type';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import { useMemo } from 'react';

interface Props {
  demands: ShuttleDemandsViewEntity[];
}

const DemandsTable = ({ demands }: Props) => {
  const memoizedDemands = useMemo(() => demands, [demands]);
  const table = useTable({
    data: memoizedDemands,
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
