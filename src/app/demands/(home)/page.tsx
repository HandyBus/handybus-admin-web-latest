'use client';

import useTable from '@/hooks/useTable';
import { columnsForGroupByEventId } from './types/table.type';
import BaseTable from '@/components/table/BaseTable';
import { useGetDemandsStats } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';

const Page = () => {
  const {
    data: demands,
    isPending,
    isError,
  } = useGetDemandsStats({
    groupBy: 'EVENT',
  });

  const table = useTable({
    data: demands,
    columns: columnsForGroupByEventId,
  });

  return (
    <main className="flex flex-col">
      <Heading>수요조사 대시보드</Heading>
      <Heading.h2>행사별 수요 조회</Heading.h2>
      <BaseTable table={table} />
      {demands?.length === 0 && <div>수요가 없습니다.</div>}
      {isPending && <div>Loading...</div>}
      {isError && <div>Failed to load demands</div>}
    </main>
  );
};

export default Page;
