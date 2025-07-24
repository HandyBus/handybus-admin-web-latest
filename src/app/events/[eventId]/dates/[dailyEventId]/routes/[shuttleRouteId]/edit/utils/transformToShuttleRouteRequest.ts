import { UpdateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { EditFormValues } from '../form.type';
import { FieldNamesMarkedBoolean } from 'react-hook-form';

export const transformToShuttleRouteRequest = (
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<EditFormValues>>>,
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

  const request = {
    ...rest,
    name: dirtyFields?.name ? data.name : undefined,
    maxPassengerCount: dirtyFields?.maxPassengerCount
      ? data.maxPassengerCount
      : undefined,
    reservationDeadline: dirtyFields?.reservationDeadline
      ? data.reservationDeadline
      : undefined,
    shuttleRouteHubs:
      dirtyFields?.shuttleRouteHubsToDestination ||
      dirtyFields?.shuttleRouteHubsFromDestination
        ? (returnHubs ?? []).concat(forwardHubs ?? [])
        : undefined,
    regularPrice: dirtyFields?.regularPrice ? data.regularPrice : undefined,
    earlybirdPrice: dirtyFields?.earlybirdPrice
      ? data.earlybirdPrice
      : undefined,
  } satisfies UpdateShuttleRouteRequest;
  return request;
};
