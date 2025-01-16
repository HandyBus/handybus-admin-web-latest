'use client';

import useTable from '@/hooks/useTable';
import { getDemand } from '@/services/v2/demand.services';
import { columnsForGroupByEventId } from './types/table.type';
import { useQuery } from '@tanstack/react-query';
import BaseTable from '@/components/table/BaseTable';

const Page = () => {
  const {
    data: demands,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['demand', 'event'],
    queryFn: async () =>
      await getDemand({
        groupBy: 'EVENT',
      }),
  });

  const table = useTable({
    data: demands,
    columns: columnsForGroupByEventId,
  });

  return (
    <div>
      <h1 className="text-[32px] font-500">행사별 수요 조회</h1>

      <BaseTable table={table} />
      {isPending && <div>Loading...</div>}
      {isError && <div>Failed to load demands</div>}
    </div>
  );
};

export default Page;
