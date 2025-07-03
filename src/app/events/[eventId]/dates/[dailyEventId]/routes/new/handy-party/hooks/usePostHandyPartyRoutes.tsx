import {
  getShuttleRoutesOfDailyEvent,
  postShuttleRoute,
} from '@/services/shuttleRoute.service';
import {
  HANDY_PARTY_ROUTE_AREA,
  HandyPartyRouteArea,
} from '@/constants/handyPartyArea.const';
import { getRegionHubs } from '@/services/hub.service';
import { useRef, useState } from 'react';
import { RegionHubsViewEntity } from '@/types/hub.type';
import { CreateShuttleRouteRequest, TripType } from '@/types/shuttleRoute.type';
import Stringifier from '@/utils/stringifier.util';
import dayjs from 'dayjs';
import { HANDY_PARTY_ROUTE_NAME_PREFIX } from '@/constants/common';
import { HandyPartyPriceTable } from '@/constants/handyPartyPriceTable.const';

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
    regularPrice,
    earlybirdPrice,
    tripType,
    reservationDeadline,
    earlybirdReservationDeadline,
    toDestinationArrivalTime,
    fromDestinationDepartureTime,
    destinationHubId,
  }: {
    area: HandyPartyRouteArea;
    regularPrice: number;
    earlybirdPrice: number;
    tripType: TripTypeWithoutRoundTrip;
    reservationDeadline: string;
    earlybirdReservationDeadline: string;
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

    const hasEarlybird = earlybirdPrice > 0; // 얼리버드 가격이 0원 이상인 경우에만 얼리버드 노선 생성

    const body: CreateShuttleRouteRequest = {
      name,
      reservationDeadline,
      earlybirdDeadline: hasEarlybird
        ? earlybirdReservationDeadline
        : undefined,
      hasEarlybird,
      regularPrice: {
        toDestination: tripType === 'TO_DESTINATION' ? regularPrice : null,
        fromDestination: tripType === 'FROM_DESTINATION' ? regularPrice : null,
        roundTrip: null,
      },
      earlybirdPrice: hasEarlybird
        ? {
            toDestination:
              tripType === 'TO_DESTINATION' ? earlybirdPrice : null,
            fromDestination:
              tripType === 'FROM_DESTINATION' ? earlybirdPrice : null,
            roundTrip: null,
          }
        : undefined,
      maxPassengerCount: 9999,
      shuttleRouteHubs:
        tripType === 'TO_DESTINATION' ? toDestinationHubs : fromDestinationHubs,
    };
    await postShuttleRoute(eventId, dailyEventId, body);
  };

  const [isLoading, setIsLoading] = useState(false);

  const createMultipleHandyPartyRoutes = async ({
    priceOfAreas,
    reservationDeadline,
    earlybirdReservationDeadline,
    toDestinationArrivalTime,
    fromDestinationDepartureTime,
    destinationHubId,
  }: {
    priceOfAreas: HandyPartyPriceTable;
    reservationDeadline: string;
    earlybirdReservationDeadline: string;
    toDestinationArrivalTime: string;
    fromDestinationDepartureTime: string;
    destinationHubId: string;
  }) => {
    setIsLoading(true);
    await fetchHandyPartyHubs();
    const routes = await getShuttleRoutesOfDailyEvent(eventId, dailyEventId);

    const existingHandyPartyRoutes = routes.filter((route) =>
      route.name.startsWith(HANDY_PARTY_ROUTE_NAME_PREFIX),
    );

    const routeTasks: {
      area: HandyPartyRouteArea;
      regularPrice: number;
      earlybirdPrice: number;
      tripType: TripTypeWithoutRoundTrip;
    }[] = [];

    HANDY_PARTY_ROUTE_AREA.forEach((area) => {
      const priceOfArea = priceOfAreas.find((el) => el.area === area);
      if (
        priceOfArea === undefined ||
        priceOfArea === null ||
        priceOfArea.regularPrice === 0
      ) {
        return;
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

      if (!toDestinationRouteExists) {
        routeTasks.push({
          area,
          regularPrice: priceOfArea.regularPrice,
          earlybirdPrice: priceOfArea.earlybirdPrice,
          tripType: 'TO_DESTINATION',
        });
      }
      if (!fromDestinationRouteExists) {
        routeTasks.push({
          area,
          regularPrice: priceOfArea.regularPrice,
          earlybirdPrice: priceOfArea.earlybirdPrice,
          tripType: 'FROM_DESTINATION',
        });
      }
    });

    // NOTE: Promise.all 사용 시 수요조사 한 사람들에게 알림톡 중복 발송됨
    for (const task of routeTasks) {
      await createSingleHandyPartyRoute({
        area: task.area,
        regularPrice: task.regularPrice,
        earlybirdPrice: task.earlybirdPrice,
        tripType: task.tripType,
        reservationDeadline,
        earlybirdReservationDeadline,
        toDestinationArrivalTime,
        fromDestinationDepartureTime,
        destinationHubId,
      });
    }
    setIsLoading(false);
  };

  return { createMultipleHandyPartyRoutes, isLoading };
};

export default usePostHandyPartyRoutes;
