'use client';

import BlueLink from '@/components/link/BlueLink';
import ColumnFilter from '@/components/table/ColumnFilter';
import { columns } from './table.type';
import { useGetEventDashboard } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
const Page = () => {
  const {
    data: eventDashboard,
    isLoading,
    isError,
    error,
  } = useGetEventDashboard();

  const table = useTable({
    data: eventDashboard,
    columns,
  });

  console.log(eventDashboard);

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
        ) : eventDashboard ? (
          <BaseTable table={table} cellClassName="min-h-120 p-0" />
        ) : (
          <div>No data</div>
        )}
      </section>
    </main>
  );
};

export default Page;
