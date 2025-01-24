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
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';

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
    <main>
      <Heading>일자별 행사 상세 정보</Heading>
      {thisDailyShuttle && (
        <Callout>
          <List>
            <List.item title="행사명">
              <BlueLink href={`/events/${eventId}`}>
                {shuttle.eventName}
              </BlueLink>
            </List.item>
            <List.item title="장소">{shuttle.eventLocationName}</List.item>
            <List.item title="날짜">
              {formatDateString(thisDailyShuttle.date)}
            </List.item>
            <List.item title="상태">
              {Stringifier.dailyEventStatus(thisDailyShuttle?.status)}
            </List.item>
          </List>
        </Callout>
      )}
      <div className="flex flex-col">
        <Heading.h2 className="flex items-baseline gap-20">
          노선 목록
          <BlueLink href={`${dailyEventId}/routes/new`} className="text-14">
            추가하기
          </BlueLink>
        </Heading.h2>
        <BaseTable table={table} />
      </div>
    </main>
  );
};

export default Page;
