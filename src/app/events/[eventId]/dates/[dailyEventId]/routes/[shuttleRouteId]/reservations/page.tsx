'use client';

import ReservationTable from './components/ReservationTable';
import { formatDateString } from '@/utils/date.util';
import { useGetShuttleRoute } from '@/services/shuttleRoute.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import { HANDY_PARTY_PREFIX } from '@/constants/common';
import { useMemo } from 'react';

interface Props {
  params: {
    eventId: string;
    dailyEventId: string;
    shuttleRouteId: string;
  };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId, shuttleRouteId } = params;

  const { data: shuttleRoute } = useGetShuttleRoute(
    eventId,
    dailyEventId,
    shuttleRouteId,
  );

  const eventName = shuttleRoute?.event?.eventName;
  const dailyEventDate = formatDateString(
    shuttleRoute?.event?.dailyEvents.find(
      (dailyEvent) => dailyEvent.dailyEventId === dailyEventId,
    )?.date,
  );

  const shuttleRouteName = shuttleRoute?.name;
  const isHandyParty = useMemo(
    () => shuttleRoute?.name.includes(HANDY_PARTY_PREFIX) ?? false,
    [shuttleRoute],
  );

  return (
    <main>
      <Heading>노선별 예약</Heading>
      <Callout>
        <List>
          <List.item title="행사명">{eventName}</List.item>
          <List.item title="일자">{dailyEventDate}</List.item>
          <List.item title="노선명">{shuttleRouteName}</List.item>
        </List>
      </Callout>
      <ReservationTable
        eventId={eventId}
        dailyEventId={dailyEventId}
        shuttleRouteId={shuttleRouteId}
        isHandyParty={isHandyParty}
      />
    </main>
  );
};

export default Page;
