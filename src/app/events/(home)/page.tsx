'use client';

import { useQuery } from '@tanstack/react-query';
import { readAllEvents } from '@/services/v2/shuttleEvent.services';
import BlueLink from '@/components/link/BlueLink';
import ColumnFilter from '@/components/table/ColumnFilter';
import BaseTable from '@/components/table/BaseTable';
import { columns, initialColumnVisibility } from './types/table.type';
import useTable from '@/hooks/useTable';
import StatusFilter, { useEventStatusOptions } from './components/StatusFilter';

const Page = () => {
  const [eventStatus] = useEventStatusOptions();

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['events', eventStatus],
    queryFn: () => readAllEvents(eventStatus),
  });

  const table = useTable({
    data: events || [],
    columns,
    initialState: {
      columnVisibility: initialColumnVisibility,
    },
  });

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">행사 대시보드</h1>
        <BlueLink href="events/new">추가하기</BlueLink>
      </header>
      <StatusFilter />
      <ColumnFilter table={table} />
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : events ? (
        <BaseTable table={table} />
      ) : (
        <div>No data</div>
      )}
    </main>
  );
};

export default Page;
