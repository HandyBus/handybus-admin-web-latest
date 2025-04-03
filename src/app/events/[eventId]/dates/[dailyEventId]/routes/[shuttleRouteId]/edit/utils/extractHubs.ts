import { UpdateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { EditFormValues } from '../form.type';

export const extractHubs = (data: EditFormValues) => {
  const returnHubs: UpdateShuttleRouteRequest['shuttleRouteHubs'] =
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

  const forwardHubs: UpdateShuttleRouteRequest['shuttleRouteHubs'] =
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

  return { forwardHubs, returnHubs };
};
