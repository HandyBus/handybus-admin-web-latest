import { ShuttleRouteHubsInShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';

export const extractSortedShuttleHubs = (
  hubs: ShuttleRouteHubsInShuttleRoutesViewEntity[],
  type: 'TO_DESTINATION' | 'FROM_DESTINATION',
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
