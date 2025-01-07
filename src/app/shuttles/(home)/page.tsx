'use client';

import BlueLink from '@/components/link/BlueLink';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';
import { getAllShuttles } from '@/services/v2/shuttleEvent.services';
import { useQuery } from '@tanstack/react-query';

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

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">셔틀 대시보드</h1>
        <BlueLink href="shuttles/new">추가하기</BlueLink>
      </header>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : shuttles ? (
        <DataTable data={shuttles} columns={columns} />
      ) : (
        <div>No data</div>
      )}
    </main>
  );
};

export default Page;
