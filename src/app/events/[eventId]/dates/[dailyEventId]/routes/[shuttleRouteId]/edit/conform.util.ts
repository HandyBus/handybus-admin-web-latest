import { UpdateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { UpdateShuttleRouteRequestFormData } from './form.type';
import dayjs from 'dayjs';

export const conform = (
  data: UpdateShuttleRouteRequestFormData,
): UpdateShuttleRouteRequest => {
  const validateSequenceOrder = (
    hubs: UpdateShuttleRouteRequest['shuttleRouteHubs'],
  ) => {
    const sortedByArrivalTime = [...hubs].sort(
      (a, b) => dayjs(a.arrivalTime).valueOf() - dayjs(b.arrivalTime).valueOf(),
    );
    const isSequenceValid = hubs.every(
      (hub, index) => hub.sequence === sortedByArrivalTime[index].sequence,
    );
    if (!isSequenceValid) {
      throw new Error('arrivalTime is not validated');
    }
    return hubs;
  };

  const validateFromToOrder = (
    froms: UpdateShuttleRouteRequest['shuttleRouteHubs'],
    tos: UpdateShuttleRouteRequest['shuttleRouteHubs'],
  ) => {
    const latestFromTime = Math.max(
      ...froms.map((hub) => dayjs(hub.arrivalTime).valueOf()),
    );

    const earliestToTime = Math.min(
      ...tos.map((hub) => dayjs(hub.arrivalTime).valueOf()),
    );

    if (latestFromTime >= earliestToTime) {
      throw new Error('arrivalTime is not validated');
    }
  };

  const tos: UpdateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsToDestination
      .filter(
        (dest): dest is { regionHubId: string; arrivalTime: string } =>
          dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        ...v,
        sequence: idx + 1,
        type: 'TO_DESTINATION',
        arrivalTime: v.arrivalTime,
      })) satisfies UpdateShuttleRouteRequest['shuttleRouteHubs'];

  const froms: UpdateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsFromDestination
      .filter(
        (dest): dest is { regionHubId: string; arrivalTime: string } =>
          dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        ...v,
        sequence: idx + 1,
        type: 'FROM_DESTINATION',
        arrivalTime: v.arrivalTime,
      })) satisfies UpdateShuttleRouteRequest['shuttleRouteHubs'];

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we don't need to use these
    shuttleRouteHubsToDestination,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we don't need to use these
    shuttleRouteHubsFromDestination,
    ...rest
  } = data;

  validateSequenceOrder(tos);
  validateSequenceOrder(froms);
  validateFromToOrder(tos, froms);
  const x = {
    ...rest,
    name: data.name,
    maxPassengerCount: data.maxPassengerCount,
    reservationDeadline: data.reservationDeadline,
    shuttleRouteHubs: froms.concat(tos),
    regularPrice: data.regularPrice,
    earlybirdPrice: data.earlybirdPrice,
  } satisfies UpdateShuttleRouteRequest;
  return x;
};
