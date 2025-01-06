'use client';

import BlueLink from '@/components/link/BlueLink';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';
import { getAllShuttles } from '@/services/v1/shuttle.services';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const {
    data: shuttles,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['shuttles'],
    queryFn: getAllShuttles,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">셔틀 대시보드</h1>
        <BlueLink href="shuttles/new">추가하기</BlueLink>
      </header>
      <DataTable data={shuttles} columns={columns} />;
    </main>
  );
};

export default Page;
