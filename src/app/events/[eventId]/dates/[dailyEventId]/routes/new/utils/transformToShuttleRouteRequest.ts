import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { CreateShuttleRouteFormValues } from '../form.type';

export const transformToShuttleRouteRequest = (
  data: CreateShuttleRouteFormValues,
  forwardHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
  returnHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
): CreateShuttleRouteRequest => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we don't need to use these
    shuttleRouteHubsToDestination,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we don't need to use these
    shuttleRouteHubsFromDestination,
    ...rest
  } = data;

  return {
    ...rest,
    shuttleRouteHubs: returnHubs.concat(forwardHubs),
    reservationDeadline: data.reservationDeadline,
    earlybirdDeadline: data.earlybirdDeadline
      ? data.earlybirdDeadline
      : undefined,
  } satisfies CreateShuttleRouteRequest;
};
