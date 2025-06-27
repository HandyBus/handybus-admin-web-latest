'use client';

import BlueLink from '@/components/link/BlueLink';
import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import { useGetEvents } from '@/services/event.service';
import { useMemo } from 'react';

const Page = () => {
  const { data } = useGetEvents({
    eventIsPinned: true,
  });

  const events = useMemo(() => data ?? [], [data]);
  const table = useTable({
    columns: columns,
    data: events,
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        이달의 추천 행사 대시보드
        <BlueLink href="/events/pin/edit" className="text-14">
          수정하기
        </BlueLink>
      </Heading>
      <section className="flex flex-col">
        <BaseTable table={table} />
      </section>
    </main>
  );
};

export default Page;
