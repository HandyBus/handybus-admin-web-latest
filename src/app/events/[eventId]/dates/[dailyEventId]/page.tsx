'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';
import { notFound } from 'next/navigation';
import { columns } from './table.type';
import { useEffect } from 'react';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import { useGetShuttleRoutesOfDailyEvent } from '@/services/shuttleRoute.service';
import { useGetEvent } from '@/services/event.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params: { eventId, dailyEventId } }: Props) => {
  const {
    data: event,
    isPending: isEventPending,
    isError: isEventError,
    error: eventError,
  } = useGetEvent(eventId);

  const {
    data: routes,
    isPending: isRoutesPending,
    isError: isRoutesError,
    error: routesError,
  } = useGetShuttleRoutesOfDailyEvent(eventId, dailyEventId);

  const table = useTable({ data: routes, columns });

  const dailyEvent = event
    ? event.dailyEvents.find((d) => d.dailyEventId === dailyEventId)
    : null;

  useEffect(() => {
    if (event && !dailyEvent) {
      notFound();
    }
  }, [event, dailyEvent]);

  if (isEventError || isRoutesError) {
    return (
      <div>
        Error! event error : {eventError?.message}, or routes error :{' '}
        {routesError?.message}
      </div>
    );
  }

  if (isEventPending || isRoutesPending) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Heading>일자별 행사 상세 정보</Heading>
      {dailyEvent && (
        <Callout>
          <List>
            <List.item title="행사명">
              <BlueLink href={`/events/${eventId}`}>{event.eventName}</BlueLink>
            </List.item>
            <List.item title="장소">{event.eventLocationName}</List.item>
            <List.item title="날짜">
              {formatDateString(dailyEvent.date)}
            </List.item>
            <List.item title="상태">
              {Stringifier.dailyEventStatus(dailyEvent?.status)}
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
          <BlueLink href="/optimizer" className="text-14">
            핸디팟 최적 경로 계산기
          </BlueLink>
        </Heading.h2>
        <BaseTable table={table} />
      </div>
    </main>
  );
};

export default Page;
