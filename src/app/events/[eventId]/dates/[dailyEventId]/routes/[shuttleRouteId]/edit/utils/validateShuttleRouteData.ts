import { UpdateShuttleRouteHubProps } from '@/types/shuttleRoute.type';
import dayjs from 'dayjs';
import { FormValues } from '../form.type';

export const validateShuttleRouteData = (
  forwardHubs: Array<UpdateShuttleRouteHubProps>,
  returnHubs: Array<UpdateShuttleRouteHubProps>,
  regularPrice: FormValues['regularPrice'],
): void => {
  if (!validateTripTypePrice(regularPrice)) {
    throw new Error('가격이 올바르지 않습니다.');
  }

  const tripType = checkTripType(forwardHubs, returnHubs);
  switch (true) {
    case tripType === 'none':
      throw new Error('가는편/오는편의 정류장을 채워주세요.');
    case !validateEachSequenceOrder(forwardHubs) ||
      !validateEachSequenceOrder(returnHubs):
      throw new Error('정류장들의 순서가 올바르지 않습니다.');
    case tripType === 'roundTrip' &&
      !validateFromToOrder(forwardHubs, returnHubs):
      throw new Error('가는편/오는편의 정류장들의 순서가 올바르지 않습니다.');
    case tripType === 'roundTrip' &&
      !validateHubsMatch(forwardHubs, returnHubs):
      throw new Error('정류장들의 목록이 서로 일치하지 않습니다.');
  }
};

const checkTripType = (
  forwardHubs: Array<UpdateShuttleRouteHubProps>,
  returnHubs: Array<UpdateShuttleRouteHubProps>,
): 'roundTrip' | 'oneWay' | 'none' => {
  switch (true) {
    case forwardHubs.length > 0 && returnHubs.length > 0:
      return 'roundTrip';
    case forwardHubs.length > 0 && returnHubs.length === 0:
      return 'oneWay';
    case forwardHubs.length === 0 && returnHubs.length > 0:
      return 'oneWay';
    default:
      return 'none';
  }
};

const validateEachSequenceOrder = (hubs: Array<UpdateShuttleRouteHubProps>) => {
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
  forwardHubs: Array<UpdateShuttleRouteHubProps>,
  returnHubs: Array<UpdateShuttleRouteHubProps>,
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
  forwardHubs: Array<UpdateShuttleRouteHubProps>,
  returnHubs: Array<UpdateShuttleRouteHubProps>,
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

const validateTripTypePrice = (regularPrice: FormValues['regularPrice']) => {
  const { roundTrip, toDestination, fromDestination } = regularPrice;
  const hasRoundTrip = roundTrip !== 0;
  const hasToDestination = toDestination !== 0;
  const hasFromDestination = fromDestination !== 0;

  if (!hasRoundTrip && !hasToDestination && !hasFromDestination) {
    return false;
  } else if (hasRoundTrip && (!hasToDestination || !hasFromDestination)) {
    return false;
  }

  return true;
};
