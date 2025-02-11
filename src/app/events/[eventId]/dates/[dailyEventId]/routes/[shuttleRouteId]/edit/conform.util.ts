import { UpdateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { UpdateShuttleRouteRequestFormData } from './form.type';
import { dayjsTz } from '@/utils/date.util';

export const conform = (
  data: UpdateShuttleRouteRequestFormData,
): UpdateShuttleRouteRequest => {
  const validateSequenceOrder = (
    hubs: UpdateShuttleRouteRequest['shuttleRouteHubs'],
  ) => {
    const sortedByArrivalTime = [...hubs].sort(
      (a, b) =>
        dayjsTz(a.arrivalTime).getTime() - dayjsTz(b.arrivalTime).getTime(),
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
      ...froms.map((hub) => dayjsTz(hub.arrivalTime).getTime()),
    );

    const earliestToTime = Math.min(
      ...tos.map((hub) => dayjsTz(hub.arrivalTime).getTime()),
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
  } satisfies UpdateShuttleRouteRequest;
  return x;
};
