'use client';

import BlueLink from '@/components/link/BlueLink';
import ColumnFilter from '@/components/table/ColumnFilter';
import BaseTable from '@/components/table/BaseTable';
import { columns, initialColumnVisibility } from './types/table.type';
import useTable from '@/hooks/useTable';
import StatusFilter, { useEventStatusOptions } from './components/StatusFilter';
import { useGetEvents } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';

const Page = () => {
  const [eventStatus, setEventStatus] = useEventStatusOptions();

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useGetEvents({
    status: eventStatus,
  });

  const table = useTable({
    data: events,
    columns,
    initialState: {
      columnVisibility: initialColumnVisibility,
    },
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        행사 대시보드
        <BlueLink href="events/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <StatusFilter eventStatus={eventStatus} setEventStatus={setEventStatus} />
      <ColumnFilter table={table} />
      <section className="flex flex-col">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : events ? (
          <BaseTable table={table} />
        ) : (
          <div>No data</div>
        )}
      </section>
    </main>
  );
};

export default Page;
