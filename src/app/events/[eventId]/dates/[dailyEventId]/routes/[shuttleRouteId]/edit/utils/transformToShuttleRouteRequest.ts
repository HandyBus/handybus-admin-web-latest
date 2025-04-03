import { UpdateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { EditFormValues } from '../form.type';

export const transformToShuttleRouteRequest = (
  data: EditFormValues,
  forwardHubs: UpdateShuttleRouteRequest['shuttleRouteHubs'],
  returnHubs: UpdateShuttleRouteRequest['shuttleRouteHubs'],
): UpdateShuttleRouteRequest => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we don't need to use these
    shuttleRouteHubsToDestination,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we don't need to use these
    shuttleRouteHubsFromDestination,
    ...rest
  } = data;

  const x = {
    ...rest,
    name: data.name,
    maxPassengerCount: data.maxPassengerCount,
    reservationDeadline: data.reservationDeadline,
    shuttleRouteHubs: returnHubs.concat(forwardHubs),
    regularPrice: data.regularPrice,
    earlybirdPrice: data.earlybirdPrice,
  } satisfies UpdateShuttleRouteRequest;
  return x;
};
