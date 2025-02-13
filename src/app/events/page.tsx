'use client';

import BlueLink from '@/components/link/BlueLink';
import { columns } from './table.type';
import { useGetEventsStats } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import { useMemo } from 'react';

const Page = () => {
  const { data: eventsStats } = useGetEventsStats();

  const flattenedEventsStats = useMemo(
    () => eventsStats?.pages.flatMap((page) => page.events),
    [eventsStats],
  );

  const table = useTable({
    data: flattenedEventsStats,
    columns,
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        행사 대시보드
        <BlueLink href="events/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <section className="flex flex-col">
        <BaseTable table={table} cellClassName="min-h-120 p-0" />
      </section>
    </main>
  );
};

export default Page;
