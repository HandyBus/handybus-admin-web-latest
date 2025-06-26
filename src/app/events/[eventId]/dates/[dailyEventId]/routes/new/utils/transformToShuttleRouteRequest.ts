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

  const toDestinationExists =
    data.regularPrice.toDestination !== 0 || data.regularPrice.roundTrip !== 0;
  const fromDestinationExists =
    data.regularPrice.fromDestination !== 0 ||
    data.regularPrice.roundTrip !== 0;
  const shuttleRouteHubs =
    toDestinationExists && fromDestinationExists
      ? returnHubs.concat(forwardHubs)
      : toDestinationExists
        ? forwardHubs
        : returnHubs;

  return {
    ...rest,
    shuttleRouteHubs,
    reservationDeadline: data.reservationDeadline,
    earlybirdDeadline: data.earlybirdDeadline
      ? data.earlybirdDeadline
      : undefined,
    regularPrice: {
      roundTrip:
        data.regularPrice.roundTrip === 0 ? null : data.regularPrice.roundTrip,
      toDestination:
        data.regularPrice.toDestination === 0
          ? null
          : data.regularPrice.toDestination,
      fromDestination:
        data.regularPrice.fromDestination === 0
          ? null
          : data.regularPrice.fromDestination,
    },
  } satisfies CreateShuttleRouteRequest;
};
