'use client';

import Callout from '@/components/text/Callout';
import Heading from '@/components/text/Heading';
import List from '@/components/text/List';
import useGetShuttleRoutesOfEvent from '@/app/events/[eventId]/sales/hooks/useGetShuttleRoutesOfEvent';
import { useGetEvent } from '@/services/event.service';
import { formatDateString } from '@/utils/date.util';
import { useMemo } from 'react';
import SalesTable from '@/app/events/[eventId]/sales/components/SalesTable';
import Button from '@/components/button/Button';

interface Props {
  params: { eventId: string };
}

const Page = ({ params }: Props) => {
  const { eventId } = params;

  // 행사 정보
  const { data: event } = useGetEvent(eventId);

  const eventDate = useMemo(() => {
    if (!event?.startDate || !event?.endDate) {
      return '';
    }
    return (
      formatDateString(event?.startDate, 'date') +
      ' ~ ' +
      formatDateString(event?.endDate, 'date')
    );
  }, [event]);

  const { data: shuttleRoutes } = useGetShuttleRoutesOfEvent(event);

  return (
    <main>
      <Heading className="flex justify-between gap-24">
        <span>매출 대시보드</span>
        <Button variant="primary" size="small" id="download-button">
          다운로드
        </Button>
      </Heading>
      <Callout className="mb-20">
        <List>
          <List.item title="행사명">{event?.eventName}</List.item>
          <List.item title="장소">{event?.eventLocationName}</List.item>
          <List.item title="날짜">{eventDate}</List.item>
        </List>
      </Callout>
      {event && shuttleRoutes && (
        <SalesTable event={event} shuttleRoutes={shuttleRoutes} />
      )}
    </main>
  );
};

export default Page;
