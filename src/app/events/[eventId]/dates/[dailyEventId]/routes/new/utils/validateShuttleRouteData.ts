import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import dayjs from 'dayjs';

export const validateShuttleRouteData = (
  body: CreateShuttleRouteRequest,
): void => {
  if (!validateTripTypePrice(body.regularPrice)) {
    throw new Error('가격이 올바르지 않습니다.');
  }

  const tripType = checkTripType(body.regularPrice);
  const forwardHubs = body.shuttleRouteHubs.filter(
    (hub) => hub.type === 'TO_DESTINATION',
  );
  const returnHubs = body.shuttleRouteHubs.filter(
    (hub) => hub.type === 'FROM_DESTINATION',
  );

  switch (true) {
    case tripType === 'none':
      throw new Error('행사장행/귀가행의 정류장을 채워주세요.');
    case !validateHubsLengthAndRole(tripType, body.shuttleRouteHubs):
      throw new Error('도착지 또는 경유지의 정류장들을 올바르게 채워주세요.');
    case !validateEachSequenceOrder(forwardHubs) ||
      !validateEachSequenceOrder(returnHubs):
      throw new Error('정류장들의 순서가 올바르지 않습니다.');
    case tripType === 'roundTrip' &&
      !validateFromToOrder(forwardHubs, returnHubs):
      throw new Error('행사장행/귀가행의 정류장들의 순서가 올바르지 않습니다.');
    case tripType === 'roundTrip' &&
      !validateHubsMatch(forwardHubs, returnHubs):
      throw new Error('정류장들의 목록이 서로 일치하지 않습니다.');
  }
};

const checkTripType = (
  regularPrice: CreateShuttleRouteRequest['regularPrice'],
): 'roundTrip' | 'toDestination' | 'fromDestination' | 'none' => {
  const hasRoundTrip = !!regularPrice.roundTrip;
  const hasToDestination = !!regularPrice.toDestination;
  const hasFromDestination = !!regularPrice.fromDestination;

  if (hasRoundTrip || (hasToDestination && hasFromDestination)) {
    return 'roundTrip';
  }
  if (hasToDestination && !hasFromDestination) {
    return 'toDestination';
  }
  if (!hasToDestination && hasFromDestination) {
    return 'fromDestination';
  }
  return 'none';
};

const validateEachSequenceOrder = (
  hubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
) => {
  const arrivalTimes = hubs.map((hub) => dayjs(hub.arrivalTime).valueOf());
  const hasDuplicateArrivalTimes =
    new Set(arrivalTimes).size !== arrivalTimes.length;

  if (hasDuplicateArrivalTimes) {
    return false;
  }

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

const validateTripTypePrice = (
  regularPrice: CreateShuttleRouteRequest['regularPrice'],
) => {
  const { roundTrip, toDestination, fromDestination } = regularPrice;

  if (
    (roundTrip && roundTrip >= 1000000) ||
    (toDestination && toDestination >= 1000000) ||
    (fromDestination && fromDestination >= 1000000)
  ) {
    return false;
  }

  const hasRoundTrip = roundTrip && roundTrip !== 0;
  const hasToDestination = toDestination && toDestination !== 0;
  const hasFromDestination = fromDestination && fromDestination !== 0;

  if (!hasRoundTrip && !hasToDestination && !hasFromDestination) {
    return false;
  } else if (
    hasRoundTrip &&
    ((hasToDestination && !hasFromDestination) ||
      (!hasToDestination && hasFromDestination))
  ) {
    return false;
  }

  return true;
};

const validateHubsLengthAndRole = (
  tripType: 'roundTrip' | 'toDestination' | 'fromDestination' | 'none',
  hubs: CreateShuttleRouteRequest['shuttleRouteHubs'],
) => {
  if (tripType === 'none') {
    return false;
  }
  const destinationCount = hubs.filter(
    (hub) => hub.role === 'DESTINATION',
  ).length;
  const toDestinationHubCount = hubs.filter(
    (hub) => hub.role === 'HUB' && hub.type === 'TO_DESTINATION',
  ).length;
  const fromDestinationHubCount = hubs.filter(
    (hub) => hub.role === 'HUB' && hub.type === 'FROM_DESTINATION',
  ).length;

  if (tripType === 'roundTrip') {
    if (
      destinationCount === 2 &&
      toDestinationHubCount >= 1 &&
      fromDestinationHubCount >= 1
    ) {
      return true;
    }
  } else if (tripType === 'toDestination') {
    if (destinationCount === 1 && toDestinationHubCount >= 1) {
      return true;
    }
  } else if (tripType === 'fromDestination') {
    if (destinationCount === 1 && fromDestinationHubCount >= 1) {
      return true;
    }
  }
  return false;
};
