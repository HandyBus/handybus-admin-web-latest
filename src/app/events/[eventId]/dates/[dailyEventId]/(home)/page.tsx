'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';
import { notFound } from 'next/navigation';
import { columns } from './types/table.type';
import { useEffect } from 'react';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import { useGetShuttleRoutesOfDailyEvent } from '@/services/shuttleOperation.service';
import { useGetEvent } from '@/services/shuttleOperation.service';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params: { eventId, dailyEventId } }: Props) => {
  const {
    data: shuttle,
    isPending: isShuttlePending,
    isError: isShuttleError,
    error: shuttleError,
  } = useGetEvent(Number(eventId));

  const {
    data: routes,
    isPending: isRoutesPending,
    isError: isRoutesError,
    error: routesError,
  } = useGetShuttleRoutesOfDailyEvent(Number(eventId), Number(dailyEventId));

  const table = useTable({ data: routes, columns });

  const thisDailyShuttle = shuttle
    ? shuttle.dailyEvents.find((d) => d.dailyEventId === Number(dailyEventId))
    : null;

  useEffect(() => {
    if (shuttle && !thisDailyShuttle) {
      notFound();
    }
  }, [shuttle, thisDailyShuttle]);

  if (isShuttleError || isRoutesError) {
    return (
      <div>
        Error! shuttle error : {shuttleError?.message}, or routes error :{' '}
        {routesError?.message}
      </div>
    );
  }

  if (isShuttlePending || isRoutesPending) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        {thisDailyShuttle && (
          <h1 className="text-[32px] font-500">
            <BlueLink href={`/events/${eventId}`}>{shuttle.eventName}</BlueLink>{' '}
            행사의 <b>{formatDateString(thisDailyShuttle.date)}</b>일자 상세
            정보
          </h1>
        )}
      </header>
      <div className="flex flex-col gap-16">
        <div>
          상태:{' '}
          {thisDailyShuttle?.status &&
            Stringifier.dailyEventStatus(thisDailyShuttle?.status)}
        </div>
        <header className="flex flex-row justify-between">
          <h1 className="text-[24px] font-500">노선 목록</h1>
          <BlueLink href={`${dailyEventId}/routes/new`}>추가하기</BlueLink>
        </header>
        <BaseTable table={table} />
      </div>
    </main>
  );
};

export default Page;
