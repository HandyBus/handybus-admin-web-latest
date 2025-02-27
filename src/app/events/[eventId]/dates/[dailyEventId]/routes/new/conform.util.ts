import { CreateShuttleRouteForm } from './form.type';
import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import dayjs from 'dayjs';

export const conform = (
  data: CreateShuttleRouteForm,
): CreateShuttleRouteRequest => {
  const validateSequenceOrder = (
    hubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
  ) => {
    const sortedByArrivalTime = [...hubs].sort(
      (a, b) =>
        dayjs.utc(a.arrivalTime).valueOf() - dayjs(b.arrivalTime).valueOf(),
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
      ...froms.map((hub) => dayjs(hub.arrivalTime).valueOf()),
    );

    const earliestToTime = Math.min(
      ...tos.map((hub) => dayjs(hub.arrivalTime).valueOf()),
    );

    if (latestFromTime >= earliestToTime) {
      throw new Error('arrivalTime is not validated');
    }
  };

  const froms: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsFromDestination
      .filter(
        (
          dest,
        ): dest is {
          regionId: string;
          regionHubId: string;
          arrivalTime: string;
        } => dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        sequence: idx + 1,
        type: 'FROM_DESTINATION',
        regionHubId: v.regionHubId,
        arrivalTime: v.arrivalTime,
      })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

  const tos: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsToDestination
      .filter(
        (
          dest,
        ): dest is {
          regionId: string;
          regionHubId: string;
          arrivalTime: string;
        } => dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        sequence: idx + 1,
        type: 'TO_DESTINATION',
        regionHubId: v.regionHubId,
        arrivalTime: v.arrivalTime,
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
    reservationDeadline: data.reservationDeadline,
    earlybirdDeadline: data.earlybirdDeadline
      ? data.earlybirdDeadline
      : undefined,
  } satisfies CreateShuttleRouteRequest;
  return x;
};
