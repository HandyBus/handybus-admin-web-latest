import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { CreateFormValues } from '../form.type';

export const transformToShuttleRouteRequest = (
  data: CreateFormValues,
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
    regularPrice: {
      roundTrip:
        data.regularPrice.roundTrip === 0
          ? undefined
          : data.regularPrice.roundTrip,
      toDestination:
        data.regularPrice.toDestination === 0
          ? undefined
          : data.regularPrice.toDestination,
      fromDestination:
        data.regularPrice.fromDestination === 0
          ? undefined
          : data.regularPrice.fromDestination,
    },
  } satisfies CreateShuttleRouteRequest;
};
