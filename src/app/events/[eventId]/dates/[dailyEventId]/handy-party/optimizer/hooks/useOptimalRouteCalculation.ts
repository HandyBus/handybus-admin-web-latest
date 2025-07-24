import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { RegionHubsViewEntity } from '@/types/hub.type';
import {
  HANDY_PARTY_OPTIMIZER_MESSAGES,
  PASSENGERS_PER_PARTY,
} from '../constants/handyPartyOptimizer.constant';
import {
  CalculatedOptimalRouteData,
  HandyPartyReservation,
  HandyPartyRoute,
} from '../types/handyPartyOptimizer.type';
import {
  calculateOptimalPath,
  createMapDisplayData,
} from '../utils/optimizer.util';

const useOptimalRouteCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const addSpacerToRouteData = useCallback(
    (
      calculatedOptimalRouteData: CalculatedOptimalRouteData[],
    ): CalculatedOptimalRouteData[] => {
      return calculatedOptimalRouteData.reduce((acc, item, index) => {
        acc.push({
          ...item,
          index: acc.length + 1,
        });

        // 5번째 인덱스마다 spacer 추가 (0, 5, 10, 15...)
        if (
          (index + 1) % PASSENGERS_PER_PARTY === 0 &&
          index < calculatedOptimalRouteData.length - 1
        ) {
          acc.push({
            index: acc.length + 1,
            order: null,
            reservationId: null,
            shuttleRouteId: null,
            shuttleName: null,
            nickname: null,
            phoneNumber: null,
            tripType: null,
            address: null,
            longitude: null,
            latitude: null,
            isSpacer: true,
          });
        }

        return acc;
      }, [] as CalculatedOptimalRouteData[]);
    },
    [],
  );

  const handleCalculateOptimalRoute = useCallback(
    async (
      route: HandyPartyRoute,
      eventPlace: RegionHubsViewEntity | null,
      handyPartyReservationList: HandyPartyReservation[],
    ) => {
      const targetHandyPartyReservations = handyPartyReservationList.filter(
        (reservation) => reservation.shuttleRouteId === route.shuttleRouteId,
      );
      const targetTripType = targetHandyPartyReservations[0]?.tripType;

      if (!targetTripType) {
        toast.error(HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.INVALID_TRIP_TYPE);
        return null;
      }

      if (!eventPlace) {
        toast.error(HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.NO_EVENT_PLACE);
        return null;
      }

      if (targetHandyPartyReservations.length === 0) {
        toast.error(HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.NO_VALID_RESERVATIONS);
        return null;
      }

      try {
        setIsCalculating(true);
        const calculatedOptimalRouteData: CalculatedOptimalRouteData[] =
          await calculateOptimalPath({
            HandyPartyReservation: targetHandyPartyReservations,
            eventPlace,
            tripType: targetTripType,
          });

        const clusteredRouteDataList = createMapDisplayData({
          calculatedData: calculatedOptimalRouteData,
        });

        const optimizedRouteDataList = addSpacerToRouteData(
          calculatedOptimalRouteData,
        );

        return {
          optimizedRouteDataList,
          clusteredRouteDataList,
        };
      } catch (error) {
        console.error(error);
        alert(HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.CALCULATION_FAILED);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    [addSpacerToRouteData],
  );

  return {
    isCalculating,
    handleCalculateOptimalRoute,
  };
};

export default useOptimalRouteCalculation;
