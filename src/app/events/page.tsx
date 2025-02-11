'use client';

import BlueLink from '@/components/link/BlueLink';
import ColumnFilter from '@/components/table/ColumnFilter';
import { columns } from './table.type';
import { useGetEvents } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BaseTable from '@/components/table/BaseTable';
import { useEventStatusOptions } from './components/StatusFilter';

const Page = () => {
  const [eventStatus] = useEventStatusOptions();

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useGetEvents({
    status: eventStatus,
  });

  const table = useReactTable({
    data: events ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        행사 대시보드
        <BlueLink href="events/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <ColumnFilter table={table} />
      <section className="flex flex-col">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : events ? (
          <BaseTable table={table} cellClassName="h-120 p-0" />
        ) : (
          <div>No data</div>
        )}
      </section>
    </main>
  );
};

export default Page;
