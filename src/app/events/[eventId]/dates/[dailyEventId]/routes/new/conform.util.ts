import { formatDate } from '@/utils/date.util';
import { CreateShuttleRouteForm } from './form.type';
import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';

export const conform = (
  data: CreateShuttleRouteForm,
): CreateShuttleRouteRequest => {
  const validateSequenceOrder = (
    hubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
  ) => {
    const sortedByArrivalTime = [...hubs].sort(
      (a, b) =>
        new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime(),
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
    froms: CreateShuttleRouteRequest['shuttleRouteHubs'],
    tos: CreateShuttleRouteRequest['shuttleRouteHubs'],
  ) => {
    const latestFromTime = Math.max(
      ...froms.map((hub) => new Date(hub.arrivalTime).getTime()),
    );

    const earliestToTime = Math.min(
      ...tos.map((hub) => new Date(hub.arrivalTime).getTime()),
    );

    if (latestFromTime >= earliestToTime) {
      throw new Error('arrivalTime is not validated');
    }
  };

  const froms: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsFromDestination
      .filter(
        (dest): dest is { regionHubId: number; arrivalTime: Date } =>
          dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        ...v,
        sequence: idx + 1,
        type: 'FROM_DESTINATION',
        arrivalTime: formatDate(v.arrivalTime, 'datetime'),
      })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

  const tos: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsToDestination
      .filter(
        (dest): dest is { regionHubId: number; arrivalTime: Date } =>
          dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        ...v,
        sequence: idx + 1,
        type: 'TO_DESTINATION',
        arrivalTime: formatDate(v.arrivalTime, 'datetime'),
      })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

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
    shuttleRouteHubs: froms.concat(tos),
    reservationDeadline: formatDate(data.reservationDeadline, 'datetime'),
    earlybirdDeadline: data.earlybirdDeadline
      ? formatDate(data.earlybirdDeadline, 'datetime')
      : undefined,
  } satisfies CreateShuttleRouteRequest;
  return x;
};
