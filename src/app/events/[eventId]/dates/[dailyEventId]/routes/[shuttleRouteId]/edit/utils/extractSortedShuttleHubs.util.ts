import {
  ShuttleRouteHubsInShuttleRoutesViewEntity,
  TripType,
} from '@/types/shuttleRoute.type';

export const extractSortedShuttleHubs = (
  hubs: ShuttleRouteHubsInShuttleRoutesViewEntity[],
  type: Exclude<TripType, 'ROUND_TRIP'>,
) => {
  return hubs
    .filter((hub) => hub.type === type)
    .sort((a, b) => a.sequence - b.sequence)
    .map((hub) => ({
      shuttleRouteHubId: hub.shuttleRouteHubId,
      regionHubId: hub.regionHubId,
      regionId: hub.regionId,
      arrivalTime: hub.arrivalTime,
      role: hub.role,
    }));
};
