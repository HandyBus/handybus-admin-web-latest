import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import dayjs from 'dayjs';

export const validateShuttleRouteData = (
  forwardHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
  returnHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
): void => {
  if (!hasHubs(forwardHubs, returnHubs)) {
    throw new Error('가는편/오는편의 정류장을 채워주세요.');
  }
  if (
    !validateEachSequenceOrder(forwardHubs) ||
    !validateEachSequenceOrder(returnHubs) ||
    !validateFromToOrder(forwardHubs, returnHubs)
  ) {
    throw new Error('정류장들의 순서가 올바르지 않습니다.');
  }
  if (!validateHubsMatch(forwardHubs, returnHubs)) {
    throw new Error('정류장들의 목록이 서로 일치하지 않습니다.');
  }
};

const hasHubs = (
  forwardHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
  returnHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
) => {
  return forwardHubs.length > 0 && returnHubs.length > 0;
};

const validateEachSequenceOrder = (
  hubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
) => {
  const sortedByArrivalTime = [...hubs].sort(
    (a, b) => dayjs(a.arrivalTime).valueOf() - dayjs(b.arrivalTime).valueOf(),
  );
  const isSequenceValid = hubs.every(
    (hub, index) => hub.sequence === sortedByArrivalTime[index].sequence,
  );
  if (!isSequenceValid) {
    return false;
  }
  return true;
};

const validateFromToOrder = (
  forwardHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
  returnHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
) => {
  const forwardLastArrivalTime = Math.max(
    ...forwardHubs.map((hub) => dayjs(hub.arrivalTime).valueOf()),
  );

  const returnFirstArrivalTime = Math.min(
    ...returnHubs.map((hub) => dayjs(hub.arrivalTime).valueOf()),
  );

  if (forwardLastArrivalTime >= returnFirstArrivalTime) {
    return false;
  }
  return true;
};

const validateHubsMatch = (
  forwardHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
  returnHubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
) => {
  const forwardHubIds = forwardHubs.map((hub) => hub.regionHubId);
  const returnHubIds = returnHubs.map((hub) => hub.regionHubId);

  if (
    forwardHubIds.every((forwardHub) => returnHubIds.includes(forwardHub)) &&
    returnHubIds.every((returnHub) => forwardHubIds.includes(returnHub))
  ) {
    return true;
  }
  return false;
};
