'use client';

import BusTable from './components/BusTable';
import ReservationTable from './components/ReservationTable';
import { formatDateString } from '@/utils/date.util';
import { useGetShuttleRoute } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';

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
      />
      <BusTable
        eventId={eventId}
        dailyEventId={dailyEventId}
        shuttleRouteId={shuttleRouteId}
      />
    </main>
  );
};

export default Page;
