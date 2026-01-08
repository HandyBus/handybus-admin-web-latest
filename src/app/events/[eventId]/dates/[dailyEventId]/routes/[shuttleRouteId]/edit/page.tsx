'use client';

import { useMemo } from 'react';
import { useGetShuttleRoute } from '@/services/shuttleRoute.service';
import Heading from '@/components/text/Heading';
import EditForm from './components/EditForm';
import { extractSortedShuttleHubs } from './utils/extractSortedShuttleHubs.util';
import { FormValues } from './form.type';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';
import BlueLink from '@/components/link/BlueLink';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId, shuttleRouteId } = params;

  const { data: route } = useGetShuttleRoute(
    eventId,
    dailyEventId,
    shuttleRouteId,
  );

  const dailyEvent = route?.event?.dailyEvents.find(
    (de) => de.dailyEventId === dailyEventId,
  );

  const defaultDate = useMemo(() => {
    return route?.event.dailyEvents.find(
      (de) => de.dailyEventId === route.dailyEventId,
    )?.date;
  }, [route]);

  const defaultValues: FormValues = useMemo(
    () => ({
      name: route?.name ?? '',
      hasEarlybird: route?.hasEarlybird ?? false,
      status: route?.status ?? 'INACTIVE',
      earlybirdDeadline: route?.earlybirdDeadline ?? undefined,
      earlybirdPrice: route?.hasEarlybird
        ? {
            roundTrip: route?.earlybirdPriceRoundTrip ?? 0,
            toDestination: route?.earlybirdPriceToDestination ?? 0,
            fromDestination: route?.earlybirdPriceFromDestination ?? 0,
          }
        : undefined,
      regularPrice: {
        roundTrip: route?.regularPriceRoundTrip ?? 0,
        toDestination: route?.regularPriceToDestination ?? 0,
        fromDestination: route?.regularPriceFromDestination ?? 0,
      },
      maxPassengerCount: route?.maxPassengerCount ?? 0,
      reservationDeadline: route?.reservationDeadline ?? '',
      shuttleRouteHubsFromDestination: extractSortedShuttleHubs(
        route?.fromDestinationShuttleRouteHubs ?? [],
        'FROM_DESTINATION',
      ),
      shuttleRouteHubsToDestination: extractSortedShuttleHubs(
        route?.toDestinationShuttleRouteHubs ?? [],
        'TO_DESTINATION',
      ),
      isReservationDisabled: {
        toDestination: route?.isReservationDisabledToDestination ?? false,
        fromDestination: route?.isReservationDisabledFromDestination ?? false,
        roundTrip: route?.isReservationDisabledRoundTrip ?? false,
      },
    }),
    [route],
  );

  if (!route || !dailyEvent) {
    return null;
  }

  return (
    <main>
      <Heading>노선 수정하기</Heading>
      <Callout className="mb-20">
        <List>
          <List.item title="행사명">
            <BlueLink href={`/events/${eventId}`}>
              {route.event.eventName}
            </BlueLink>
          </List.item>
          <List.item title="장소">{route.event.eventLocationName}</List.item>
          <List.item title="날짜">
            {formatDateString(dailyEvent.date)}
          </List.item>
          <List.item title="상태">
            {Stringifier.dailyEventStatus(dailyEvent.status)}
          </List.item>
        </List>
      </Callout>
      <EditForm
        params={params}
        defaultValues={defaultValues}
        defaultDate={defaultDate}
      />
    </main>
  );
};

export default Page;
