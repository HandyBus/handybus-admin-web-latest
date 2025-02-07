'use client';

import BlueLink from '@/components/link/BlueLink';
import { columns } from './table.type';
import EventViewer from './components/Shuttle';
import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import JSONViewer from '@/components/json/JSONViewer';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';
import { useGetEvent } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';

interface Props {
  params: { eventId: string };
}

const Page = ({ params: { eventId } }: Props) => {
  const { data: event } = useGetEvent(eventId);

  const columnsForThisShuttleId = useMemo(() => columns(eventId), [eventId]);

  const table = useTable({
    data: event?.dailyEvents,
    columns: columnsForThisShuttleId,
  });

  if (!event)
    return (
      <div>
        <Loader2Icon className="animate-spin" size={64} />
      </div>
    );

  return (
    <main className="flex size-full flex-col gap-16 bg-white ">
      <Heading className="flex items-baseline gap-20">
        행사 상세 정보
        <BlueLink href={`${eventId}/edit`} className="text-14">
          수정하기
        </BlueLink>
      </Heading>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <JSONViewer value={event} />
        <BlueLink href={`/demands/${eventId}`}>
          이 행사의 수요 조사 조회
        </BlueLink>
      </div>
      <EventViewer event={event} />
      <section className="flex flex-col">
        <Heading.h2>일자별 행사</Heading.h2>
        <BaseTable table={table} />
      </section>
    </main>
  );
};

export default Page;
