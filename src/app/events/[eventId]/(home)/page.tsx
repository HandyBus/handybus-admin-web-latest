'use client';

import BlueLink from '@/components/link/BlueLink';
import { columns } from './types/table.type';
import EventViewer from './components/Shuttle';
import { getEvent } from '@/services/v2/event.services';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import JSONViewer from '@/components/json/JSONViewer';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';

interface Props {
  params: { eventId: string };
}

const Page = ({ params: { eventId } }: Props) => {
  const { data: event } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEvent(Number(eventId)),
  });

  const columnsForThisShuttleId = useMemo(
    () => columns(Number(eventId)),
    [eventId],
  );

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
      <h1 className="text-[32px] font-500">
        <b>{event?.eventName}</b> 행사의 상세 정보
      </h1>
      <div className="flex flex-col gap-16">
        <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
          <JSONViewer value={event} />
          <BlueLink href={`${eventId}/edit`}>수정</BlueLink>
          <BlueLink href={`/demands/${eventId}`}>
            이 행사의 수요 조사 조회
          </BlueLink>
        </div>
        <EventViewer event={event} />
        <header className="flex flex-row justify-between pt-32  ">
          <h2 className="text-[24px] font-500">행사 일자 목록</h2>
        </header>
        <BaseTable table={table} />
      </div>
    </main>
  );
};

export default Page;
