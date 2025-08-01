'use client';

import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';
import { notFound } from 'next/navigation';
import { columns } from './table.type';
import { useEffect, useMemo } from 'react';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import { useGetShuttleRoutesOfDailyEvent } from '@/services/shuttleRoute.service';
import { useGetEvent } from '@/services/event.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import { HANDY_PARTY_PREFIX } from '@/constants/common';
import { HANDY_PARTY_ROUTE_AREA } from '@/constants/handyPartyArea.const';

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

  const sortedRoutes = useMemo(() => {
    if (!routes) {
      return [];
    }

    const handyPartyRoutes = routes.filter((r) =>
      r.name.includes(HANDY_PARTY_PREFIX),
    );
    const shuttleRoutes = routes.filter(
      (r) => !r.name.includes(HANDY_PARTY_PREFIX),
    );
    const sortedHandyPartyRoutes = handyPartyRoutes.sort((a, b) => {
      const aArea = a.name.split('_')[1];
      const bArea = b.name.split('_')[1];
      const aIndex = HANDY_PARTY_ROUTE_AREA.findIndex((area) => area === aArea);
      const bIndex = HANDY_PARTY_ROUTE_AREA.findIndex((area) => area === bArea);
      const aTripType = a.name.split('_')[2];
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }
      if (aIndex === bIndex) {
        return aTripType === '가는편' ? -1 : 1;
      }
      return aIndex < bIndex ? -1 : 1;
    });
    return [...shuttleRoutes, ...sortedHandyPartyRoutes];
  }, [routes]);

  const table = useTable({ data: sortedRoutes, columns });

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
          <BlueLink
            href={`${dailyEventId}/handy-party/optimizer-paste`}
            className="text-14"
          >
            핸디팟 최적 경로 계산기 (엑셀 복붙하기)
          </BlueLink>
          <BlueLink
            href={`${dailyEventId}/handy-party/optimizer`}
            className="text-14"
          >
            일자별 행사 핸디팟 최적 경로 계산기 (엑셀 추출하기)
          </BlueLink>
          <BlueLink
            href={`${dailyEventId}/handy-party/vehicle-auto-assignment`}
            className="text-14"
          >
            일자별 행사 핸디팟 자동 배차하기
          </BlueLink>
        </Heading.h2>
        <BaseTable table={table} />
      </div>
    </main>
  );
};

export default Page;
