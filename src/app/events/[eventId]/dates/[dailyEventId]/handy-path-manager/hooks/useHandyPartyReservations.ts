import { useMemo } from 'react';
import { HANDY_PARTY_PREFIX } from '@/constants/common';
import { HANDY_PARTY_OPTIMIZER_MESSAGES } from '../../handy-party-optimizer/constants/handyPartyOptimizer.constant';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import {
  HandyPartyReservation,
  HandyPartyRoute,
  TripTypeWithoutRoundTrip,
} from '../../handy-party-optimizer/types/handyPartyOptimizer.type';
import dayjs from 'dayjs';

interface Props {
  eventId: string;
  dailyEventId: string;
  checkedRouteIds: Set<string>;
}

const useHandyPartyReservations = ({
  eventId,
  dailyEventId,
  checkedRouteIds,
}: Props) => {
  const {
    data: reservations,
    isLoading: isReservationsLoading,
    isError: isReservationsError,
  } = useGetReservationsWithPagination({
    eventId,
    dailyEventId,
    reservationStatus: 'COMPLETE_PAYMENT',
    cancelStatus: 'NONE',
  });

  const reservationsData = useMemo(
    () => reservations?.pages?.flatMap((page) => page.reservations),
    [reservations],
  );

  const handyPartyReservationList: HandyPartyReservation[] = useMemo(() => {
    if (!reservationsData) return [];

    return reservationsData.reduce<HandyPartyReservation[]>((acc, r) => {
      // 핸디팟 노선이 아닌 경우 스킵
      if (!r.shuttleRoute.name.includes(HANDY_PARTY_PREFIX)) {
        return acc;
      }

      // 필수 데이터가 없는 경우 스킵
      if (
        !r.metadata.desiredHubAddress ||
        !r.metadata.desiredHubLatitude ||
        !r.metadata.desiredHubLongitude
      ) {
        console.error(
          `desiredHubAddress, desiredHubLatitude, desiredHubLongitude is null: ${r.reservationId}`,
        );
        alert(
          `${HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.MISSING_HUB_DATA} reservationId: ${r.reservationId}`,
        );
        return acc;
      }

      const createReservationData = (): HandyPartyReservation => ({
        reservationId: r.reservationId,
        shuttleRouteId: r.shuttleRouteId,
        shuttleName: r.shuttleRoute.name,
        nickname: r.userNickname,
        phoneNumber: r.userPhoneNumber,
        tripType: r.type as TripTypeWithoutRoundTrip,
        address: r.metadata.desiredHubAddress!,
        latitude: r.metadata.desiredHubLatitude!,
        longitude: r.metadata.desiredHubLongitude!,
      });

      // 승객 수에 따라 데이터 생성
      if (r.passengerCount >= 2) {
        for (let i = 0; i < r.passengerCount; i++) {
          acc.push(createReservationData());
        }
      } else {
        acc.push(createReservationData());
      }

      return acc;
    }, []);
  }, [reservationsData]);

  const availableHandyPartyRouteList: HandyPartyRoute[] = useMemo(() => {
    return handyPartyReservationList.reduce((acc, reservation) => {
      const existingRoute = acc.find(
        (route) => route.shuttleRouteId === reservation.shuttleRouteId,
      );
      if (!existingRoute) {
        acc.push({
          shuttleRouteId: reservation.shuttleRouteId,
          shuttleName: reservation.shuttleName,
          isChecked: checkedRouteIds.has(reservation.shuttleRouteId),
        });
      }
      return acc;
    }, [] as HandyPartyRoute[]);
  }, [handyPartyReservationList, checkedRouteIds]);

  const handyPartyEventInformation = useMemo(() => {
    if (!reservationsData?.[0]) return null;
    const eventName = reservationsData[0].shuttleRoute.event.eventName;
    const eventLocationName =
      reservationsData[0].shuttleRoute.event.eventLocationName;
    const dailyEventDate =
      reservationsData[0].shuttleRoute.event.dailyEvents.find(
        (item) => item.dailyEventId === dailyEventId,
      );
    const dailyEventDateString = dailyEventDate
      ? dayjs(dailyEventDate.date).format('YYYY-MM-DD')
      : '';
    return {
      eventName,
      eventLocationName,
      dailyEventDate: dailyEventDateString,
    };
  }, [reservationsData, dailyEventId]);

  return {
    handyPartyReservationList,
    availableHandyPartyRouteList,
    isReservationsLoading,
    isReservationsError,
    handyPartyEventInformation,
  };
};

export default useHandyPartyReservations;
