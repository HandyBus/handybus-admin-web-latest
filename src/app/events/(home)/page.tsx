'use client';

import BlueLink from '@/components/link/BlueLink';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';
import { getAllShuttles } from '@/services/v2/shuttleEvent.services';
import { useQuery } from '@tanstack/react-query';
import useColumnVisibility from '@/hooks/useColumnVisibility';

const Page = () => {
  const {
    data: shuttles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shuttles'],
    queryFn: getAllShuttles,
  });

  const [columnVisibility, Filter] = useColumnVisibility(columns);

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">이벤트 대시보드</h1>
        <BlueLink href="events/new">추가하기</BlueLink>
      </header>
      {/* <ColumnDisplay /> */}
      <Filter columnVisibility={columnVisibility} />
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : shuttles ? (
        <DataTable
          data={shuttles}
          columns={columns}
          columnVisibility={columnVisibility}
        />
      ) : (
        <div>No data</div>
      )}
    </main>
  );
};

export default Page;
