import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { BulkRouteItem } from '../form.type';
import {
  calculateToDestinationArrivalTime,
  calculateFromDestinationArrivalTime,
} from './calculateArrivalTime.util';

/**
 * 폼 데이터를 API 요청 형식으로 변환합니다.
 */
export const createShuttleRouteRequest = (
  route: BulkRouteItem,
  dailyEventDate: string,
  reservationDeadline: string,
  toDestinationArrivalTime: string | undefined,
  fromDestinationDepartureTime: string | undefined,
): CreateShuttleRouteRequest => {
  const toDestinationExists = route.regularPrice.toDestination > 0;
  const fromDestinationExists = route.regularPrice.fromDestination > 0;
  const roundTripExists = route.regularPrice.roundTrip > 0;

  const toDestinationHubs =
    toDestinationExists || roundTripExists
      ? route.toDestinationHubs
          .filter(
            (
              hub,
            ): hub is {
              regionId: string;
              regionHubId: string;
              latitude: number;
              longitude: number;
            } =>
              !!hub?.regionId &&
              !!hub?.regionHubId &&
              !!hub?.latitude &&
              !!hub?.longitude,
          )
          .map((hub, index, array) => {
            const arrivalTime = calculateToDestinationArrivalTime(
              index,
              array.length,
              dailyEventDate,
              route,
              toDestinationArrivalTime,
            );

            return {
              regionHubId: hub.regionHubId,
              type: 'TO_DESTINATION' as const,
              role:
                index === array.length - 1
                  ? ('DESTINATION' as const)
                  : ('HUB' as const),
              sequence: index + 1,
              arrivalTime,
            };
          })
      : [];

  const fromDestinationHubs =
    fromDestinationExists || roundTripExists
      ? route.toDestinationHubs
          .toReversed()
          .filter(
            (
              hub,
            ): hub is {
              regionId: string;
              regionHubId: string;
              latitude: number;
              longitude: number;
            } =>
              !!hub?.regionId &&
              !!hub?.regionHubId &&
              !!hub?.latitude &&
              !!hub?.longitude,
          )
          .map((hub, index) => {
            const arrivalTime = calculateFromDestinationArrivalTime(
              index,
              dailyEventDate,
              route,
              fromDestinationDepartureTime,
            );

            return {
              regionHubId: hub.regionHubId,
              type: 'FROM_DESTINATION' as const,
              role: index === 0 ? ('DESTINATION' as const) : ('HUB' as const),
              sequence: index + 1,
              arrivalTime,
            };
          })
      : [];

  const regularPrice = {
    roundTrip:
      route.regularPrice.roundTrip === 0 ? null : route.regularPrice.roundTrip,
    toDestination:
      route.regularPrice.toDestination === 0
        ? null
        : route.regularPrice.toDestination,
    fromDestination:
      route.regularPrice.fromDestination === 0
        ? null
        : route.regularPrice.fromDestination,
  };

  const earlybirdPrice = route.hasEarlybird
    ? {
        roundTrip:
          route.earlybirdPrice.roundTrip === 0 ||
          regularPrice.roundTrip === 0 ||
          regularPrice.roundTrip === null
            ? null
            : route.earlybirdPrice.roundTrip,
        toDestination:
          route.earlybirdPrice.toDestination === 0 ||
          regularPrice.toDestination === 0 ||
          regularPrice.toDestination === null
            ? null
            : route.earlybirdPrice.toDestination,
        fromDestination:
          route.earlybirdPrice.fromDestination === 0 ||
          regularPrice.fromDestination === 0 ||
          regularPrice.fromDestination === null
            ? null
            : route.earlybirdPrice.fromDestination,
      }
    : undefined;

  return {
    isHandyParty: false,
    name: route.name,
    reservationDeadline,
    hasEarlybird: route.hasEarlybird,
    earlybirdPrice,
    regularPrice,
    earlybirdDeadline: reservationDeadline,
    maxPassengerCount: route.maxPassengerCount,
    shuttleRouteHubs: [...toDestinationHubs, ...fromDestinationHubs],
  };
};
