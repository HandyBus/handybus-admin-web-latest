import {
  getShuttleRoutesOfDailyEvent,
  postShuttleRoute,
} from '@/services/shuttleRoute.service';
import {
  HANDY_PARTY_ROUTE_AREA,
  HandyPartyRouteArea,
} from '@/constants/handyPartyArea.const';
import { getRegionHubs } from '@/services/hub.service';
import { useRef } from 'react';
import { RegionHubsViewEntity } from '@/types/hub.type';
import { CreateShuttleRouteRequest, TripType } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';
import dayjs from 'dayjs';
import { HANDY_PARTY_ROUTE_NAME_PREFIX } from '@/constants/common';

type TripTypeWithoutRoundTrip = Exclude<TripType, 'ROUND_TRIP'>;

interface Props {
  eventId: string;
  dailyEventId: string;
}

const usePostHandyPartyRoutes = ({ eventId, dailyEventId }: Props) => {
  const handyPartyHubs = useRef<RegionHubsViewEntity[]>([]);

  const fetchHandyPartyHubs = async () => {
    const res = await getRegionHubs({
      usageType: ['HANDY_PARTY'],
    });
    handyPartyHubs.current = res.regionHubs;
  };

  const createHandyPartyRouteName = (
    area: HandyPartyRouteArea,
    tripType: TripTypeWithoutRoundTrip,
  ) => {
    const tripTypeString = Stringifier.tripType(tripType);
    return `${HANDY_PARTY_ROUTE_NAME_PREFIX}_${area}_${tripTypeString}`;
  };

  const createSingleHandyPartyRoute = async ({
    area,
    price,
    tripType,
    reservationDeadline,
    toDestinationArrivalTime,
    fromDestinationDepartureTime,
    destinationHubId,
  }: {
    area: HandyPartyRouteArea;
    price: number;
    tripType: TripTypeWithoutRoundTrip;
    reservationDeadline: string;
    toDestinationArrivalTime: string;
    fromDestinationDepartureTime: string;
    destinationHubId: string;
  }) => {
    const targetHub = handyPartyHubs.current.find((hub) => hub.name === area);

    if (!targetHub) {
      return;
    }

    const name = createHandyPartyRouteName(area, tripType);

    const toDestinationHubs = [
      {
        regionHubId: targetHub.regionHubId,
        type: 'TO_DESTINATION' as const,
        role: 'HUB' as const,
        sequence: 1,
        arrivalTime: dayjs(toDestinationArrivalTime)
          .subtract(1, 'hour')
          .toISOString(),
      },
      {
        regionHubId: destinationHubId,
        type: 'TO_DESTINATION' as const,
        role: 'DESTINATION' as const,
        sequence: 2,
        arrivalTime: toDestinationArrivalTime,
      },
    ];

    const fromDestinationHubs = [
      {
        regionHubId: destinationHubId,
        type: 'FROM_DESTINATION' as const,
        role: 'DESTINATION' as const,
        sequence: 1,
        arrivalTime: fromDestinationDepartureTime,
      },
      {
        regionHubId: targetHub.regionHubId,
        type: 'FROM_DESTINATION' as const,
        role: 'HUB' as const,
        sequence: 2,
        arrivalTime: dayjs(fromDestinationDepartureTime)
          .add(1, 'hour')
          .toISOString(),
      },
    ];

    const body: CreateShuttleRouteRequest = {
      name,
      reservationDeadline,
      hasEarlybird: false,
      regularPrice: {
        toDestination: tripType === 'TO_DESTINATION' ? price : null,
        fromDestination: tripType === 'FROM_DESTINATION' ? price : null,
        roundTrip: null,
      },
      maxPassengerCount: 9999,
      shuttleRouteHubs:
        tripType === 'TO_DESTINATION' ? toDestinationHubs : fromDestinationHubs,
    };
    await postShuttleRoute(eventId, dailyEventId, body);
  };

  const createMultipleHandyPartyRoutes = async ({
    priceOfAreas,
    reservationDeadline,
    toDestinationArrivalTime,
    fromDestinationDepartureTime,
    destinationHubId,
  }: {
    priceOfAreas: {
      area: HandyPartyRouteArea;
      price: number;
    }[];
    reservationDeadline: string;
    toDestinationArrivalTime: string;
    fromDestinationDepartureTime: string;
    destinationHubId: string;
  }) => {
    await fetchHandyPartyHubs();
    const routes = await getShuttleRoutesOfDailyEvent(eventId, dailyEventId);

    const existingHandyPartyRoutes = routes.filter((route) =>
      route.name.startsWith(HANDY_PARTY_ROUTE_NAME_PREFIX),
    );

    const newRoutePromises: Promise<void>[] = HANDY_PARTY_ROUTE_AREA.reduce(
      (acc, area) => {
        const priceOfArea = priceOfAreas.find((el) => el.area === area)?.price;
        if (
          priceOfArea === undefined ||
          priceOfArea === null ||
          priceOfArea === 0
        ) {
          return acc;
        }

        const existingRoutesOfArea = existingHandyPartyRoutes.filter((route) =>
          route.name.includes(area),
        );

        const toDestinationRouteExists = existingRoutesOfArea.some((route) =>
          route.name.includes('가는편'),
        );
        const fromDestinationRouteExists = existingRoutesOfArea.some((route) =>
          route.name.includes('오는편'),
        );

        const newRoutes: Promise<void>[] = [];

        if (!toDestinationRouteExists) {
          newRoutes.push(
            createSingleHandyPartyRoute({
              area,
              price: priceOfArea,
              tripType: 'TO_DESTINATION',
              reservationDeadline,
              toDestinationArrivalTime,
              fromDestinationDepartureTime,
              destinationHubId,
            }),
          );
        }
        if (!fromDestinationRouteExists) {
          newRoutes.push(
            createSingleHandyPartyRoute({
              area,
              price: priceOfArea,
              tripType: 'FROM_DESTINATION',
              reservationDeadline,
              toDestinationArrivalTime,
              fromDestinationDepartureTime,
              destinationHubId,
            }),
          );
        }
        return acc.concat(newRoutes);
      },
      [] as Promise<void>[],
    );

    await Promise.all(newRoutePromises);
  };

  return { createMultipleHandyPartyRoutes };
};

export default usePostHandyPartyRoutes;
