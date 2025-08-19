import { UpdateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { FormValues } from '../form.type';

export const extractHubs = (data: FormValues) => {
  const returnHubs: UpdateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsFromDestination
      .filter(
        (
          dest,
        ): dest is {
          regionHubId: string;
          arrivalTime: string;
        } => dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        ...v,
        sequence: idx + 1,
        type: 'FROM_DESTINATION',
        arrivalTime: v.arrivalTime,
        role: idx === 0 ? 'DESTINATION' : 'HUB',
      })) satisfies UpdateShuttleRouteRequest['shuttleRouteHubs'];

  const forwardHubs: UpdateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsToDestination
      .filter(
        (
          dest,
        ): dest is {
          regionHubId: string;
          arrivalTime: string;
        } => dest.regionHubId !== null,
      )
      .map((v, idx, arr) => ({
        ...v,
        sequence: idx + 1,
        type: 'TO_DESTINATION',
        arrivalTime: v.arrivalTime,
        role: idx === arr.length - 1 ? 'DESTINATION' : 'HUB',
      })) satisfies UpdateShuttleRouteRequest['shuttleRouteHubs'];

  return { forwardHubs, returnHubs };
};
