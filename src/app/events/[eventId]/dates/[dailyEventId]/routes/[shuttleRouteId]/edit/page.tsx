'use client';

import { useMemo } from 'react';
import { useGetShuttleRoute } from '@/services/shuttleRoute.service';
import Heading from '@/components/text/Heading';
import EditForm from './components/EditForm';
import { extractSortedShuttleHubs } from './utils/extractSortedShuttleHubs.util';
import { EditFormValues } from './form.type';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId, shuttleRouteId } = params;

  const {
    data: route,
    isPending: isRoutePending,
    isError: isRouteError,
    error: routeError,
  } = useGetShuttleRoute(eventId, dailyEventId, shuttleRouteId);

  const defaultDate = useMemo(() => {
    return route?.event.dailyEvents.find(
      (de) => de.dailyEventId === route.dailyEventId,
    )?.date;
  }, [route]);

  const defaultValues: EditFormValues = useMemo(
    () => ({
      name: route?.name ?? '',
      hasEarlybird: route?.hasEarlybird ?? false,
      earlybirdDeadline: route?.earlybirdDeadline ?? '',
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
    }),
    [route],
  );

  if (isRoutePending) return <div>Loading...</div>;
  if (isRouteError) throw routeError;
  return (
    <main>
      <Heading>노선 수정하기</Heading>
      <EditForm
        params={params}
        defaultValues={defaultValues}
        defaultDate={defaultDate}
      />
    </main>
  );
};

export default Page;
