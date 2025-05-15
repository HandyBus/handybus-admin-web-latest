import { CreateFormValues } from '../form.type';
import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';

export const extractHubs = (data: CreateFormValues) => {
  const returnHubs: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsFromDestination
      .filter(
        (
          dest,
        ): dest is {
          regionId: string;
          regionHubId: string;
          arrivalTime: string;
          latitude: number;
          longitude: number;
        } => dest.regionHubId !== null,
      )
      .map((v, idx) => ({
        sequence: idx + 1,
        type: 'FROM_DESTINATION',
        regionHubId: v.regionHubId,
        arrivalTime: v.arrivalTime,
        role: idx === 0 ? 'DESTINATION' : 'HUB',
      })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

  const forwardHubs: CreateShuttleRouteRequest['shuttleRouteHubs'] =
    data.shuttleRouteHubsToDestination
      .filter(
        (
          dest,
        ): dest is {
          regionId: string;
          regionHubId: string;
          arrivalTime: string;
          latitude: number;
          longitude: number;
        } => dest.regionHubId !== null,
      )
      .map((v, idx, arr) => ({
        sequence: idx + 1,
        type: 'TO_DESTINATION',
        regionHubId: v.regionHubId,
        arrivalTime: v.arrivalTime,
        role: idx === arr.length - 1 ? 'DESTINATION' : 'HUB',
      })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

  return { forwardHubs, returnHubs };
};
