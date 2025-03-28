import { CreateShuttleRouteFormValues } from '../form.type';
import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';

export const extractHubs = (data: CreateShuttleRouteFormValues) => {
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
      .map((v, idx) => ({
        sequence: idx + 1,
        type: 'TO_DESTINATION',
        regionHubId: v.regionHubId,
        arrivalTime: v.arrivalTime,
      })) satisfies CreateShuttleRouteRequest['shuttleRouteHubs'];

  return { forwardHubs, returnHubs };
};
