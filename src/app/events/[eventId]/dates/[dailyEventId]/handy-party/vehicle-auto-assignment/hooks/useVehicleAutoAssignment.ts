import { useState } from 'react';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import {
  getShuttleBuses,
  postBulkAssignBus,
  postShuttleBus,
} from '@/services/shuttleBus.service';
import { HANDY_PARTY_PREFIX } from '@/constants/common';
import { parseInputData } from '../parseInputData';
import {
  HandyPartySheetData,
  ReservationBusMap,
  VehicleAssignment,
  CreatedShuttleBusInfo,
} from '../types/type';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import { ReservationViewEntity } from '@/types/reservation.type';

const BUS_TYPE = 'STARIA_7' as const;

interface UseVehicleAutoAssignmentProps {
  eventId: string;
  dailyEventId: string;
  shuttleRoutes: AdminShuttleRoutesViewEntity[];
  dailyEventDate: string;
  createCurrentTimeLog: (message: string) => void;
}

export const useVehicleAutoAssignment = ({
  eventId,
  dailyEventId,
  shuttleRoutes,
  dailyEventDate,
  createCurrentTimeLog,
}: UseVehicleAutoAssignmentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: reservations,
    isLoading: isLoadingReservations,
    isError: isErrorReservations,
  } = useGetReservationsWithPagination({
    eventId,
    dailyEventId,
    reservationStatus: 'COMPLETE_PAYMENT',
    cancelStatus: 'NONE',
  });

  const handyPartyShuttleRoutesMap = new Map(
    shuttleRoutes
      ?.filter((shuttleRoute) => shuttleRoute.name.includes(HANDY_PARTY_PREFIX))
      .map((shuttleRoute) => [shuttleRoute.name, shuttleRoute]) || [],
  );

  const handyPartyReservations: ReservationViewEntity[] =
    reservations?.pages.flatMap((page) =>
      page.reservations
        .filter(
          (reservation) =>
            reservation.shuttleRoute.name.includes(HANDY_PARTY_PREFIX) &&
            reservation.cancelStatus === 'NONE' &&
            reservation.reservationStatus === 'COMPLETE_PAYMENT',
        )
        .toSorted((a, b) => b.passengerCount - a.passengerCount),
    ) || [];

  const handleAutoAssignment = async (inputText: string) => {
    setIsProcessing(true);
    createCurrentTimeLog('=== 시작하기 버튼 클릭 ===');

    try {
      const parsedData = await parseInputDataWithValidation(
        inputText,
        dailyEventDate,
        createCurrentTimeLog,
      );
      const vehicleAssignmentMap = createVehicleAssignmentMap(
        parsedData,
        handyPartyShuttleRoutesMap,
        createCurrentTimeLog,
      );

      await processBusCreation(
        eventId,
        dailyEventId,
        createCurrentTimeLog,
        vehicleAssignmentMap,
      );
      await processPassengerAssignment(
        eventId,
        dailyEventId,
        createCurrentTimeLog,
        parsedData,
        vehicleAssignmentMap,
        handyPartyReservations,
        handyPartyShuttleRoutesMap,
      );
    } catch (error) {
      createCurrentTimeLog(`[오류] 자동 배차 처리 중 오류 발생: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    isLoadingReservations,
    isErrorReservations,
    handyPartyReservations,
    handleAutoAssignment,
  };
};

const parseInputDataWithValidation = async (
  inputText: string,
  dailyEventDate: string,
  createCurrentTimeLog: (message: string) => void,
): Promise<HandyPartySheetData[]> => {
  createCurrentTimeLog('=== 타다 시트 데이터 불러오는 중 ===');

  const parsed: HandyPartySheetData[] = parseInputData({
    text: inputText,
    dailyEventDate,
    createCurrentTimeLog,
  });

  if (parsed.length === 0) {
    const errorMessage =
      '유효한 주소 데이터가 없습니다. 타다 시트 데이터를 다시 복사하세요.';
    alert('유효한 주소 데이터가 없습니다.');
    createCurrentTimeLog(errorMessage);
    throw new Error(errorMessage);
  }

  createCurrentTimeLog('=== 타다 시트 데이터 불러오기 완료 ===');
  return parsed;
};

const createVehicleAssignmentMap = (
  parsedItems: HandyPartySheetData[],
  handyPartyShuttleRoutesMap: Map<string, AdminShuttleRoutesViewEntity>,
  createCurrentTimeLog: (message: string) => void,
): Map<string, VehicleAssignment[]> => {
  createCurrentTimeLog('=== 노선당 차량 정보 데이터 생성 중 ===');

  const vehicleAssignmentMap = new Map<string, VehicleAssignment[]>();

  parsedItems.forEach((parsedItem) => {
    const { region, tripType } = parsedItem;
    const expectedShuttleName = `${HANDY_PARTY_PREFIX}_${region}_${tripType}`;
    const matchingShuttleRoute =
      handyPartyShuttleRoutesMap.get(expectedShuttleName);

    if (matchingShuttleRoute) {
      addVehicleAssignmentToMap(
        vehicleAssignmentMap,
        parsedItem,
        matchingShuttleRoute,
      );
    } else {
      createCurrentTimeLog(
        `[경고] ${expectedShuttleName} 노선을 찾을 수 없습니다. 해당 노선의 차량정보를 생성하지 않고 넘어갑니다.`,
      );
    }
  });

  createCurrentTimeLog('=== 노선당 차량 정보 데이터 생성 완료 ===');
  return vehicleAssignmentMap;
};

const addVehicleAssignmentToMap = (
  vehicleAssignmentMap: Map<string, VehicleAssignment[]>,
  parsedItem: HandyPartySheetData,
  matchingShuttleRoute: AdminShuttleRoutesViewEntity,
) => {
  const { region, tripType, partyId, vehicleNumber, driverPhoneNumber } =
    parsedItem;
  const { shuttleRouteId, name: shuttleName } = matchingShuttleRoute;

  if (!vehicleAssignmentMap.has(shuttleRouteId)) {
    vehicleAssignmentMap.set(shuttleRouteId, []);
  }

  const vehicleName = `${HANDY_PARTY_PREFIX}_${region}_${tripType}_${partyId}호차`;
  const vehicleAssignment: VehicleAssignment = {
    shuttleRouteId,
    shuttleName,
    partyId,
    vehicleName,
    vehicleNumber,
    driverPhoneNumber,
    region,
    tripType,
  };

  const routeArray = vehicleAssignmentMap.get(shuttleRouteId);
  const isVehicleCreated = routeArray?.some(
    (item) => item.vehicleName === vehicleName,
  );

  if (routeArray && !isVehicleCreated) {
    routeArray.push(vehicleAssignment);
  }
};

// Bus creation functions
const processBusCreation = async (
  eventId: string,
  dailyEventId: string,
  createCurrentTimeLog: (message: string) => void,
  vehicleAssignmentMap: Map<string, VehicleAssignment[]>,
) => {
  createCurrentTimeLog('=== 버스 생성 단계 시작 ===');

  for (const [shuttleRouteId, vehicleAssignments] of vehicleAssignmentMap) {
    await processBusCreationForRoute(
      eventId,
      dailyEventId,
      shuttleRouteId,
      vehicleAssignments,
      createCurrentTimeLog,
    );
  }

  createCurrentTimeLog('=== 버스 생성 단계 완료 ===');
};

const processBusCreationForRoute = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  vehicleAssignments: VehicleAssignment[],
  createCurrentTimeLog: (message: string) => void,
) => {
  const shuttleBuses = await getShuttleBuses(
    eventId,
    dailyEventId,
    shuttleRouteId,
  );
  const shuttleBusesMap = new Map(
    shuttleBuses.map((shuttleBus) => [shuttleBus.busName, shuttleBus]),
  );

  const shuttleBusesToCreate = vehicleAssignments.filter(
    (vehicleAssignment) => !shuttleBusesMap.has(vehicleAssignment.vehicleName),
  );

  if (shuttleBusesToCreate.length > 0) {
    await createBusesForRoute(
      eventId,
      dailyEventId,
      shuttleRouteId,
      shuttleBusesToCreate,
      vehicleAssignments[0]?.shuttleName,
      createCurrentTimeLog,
    );
  } else {
    createCurrentTimeLog(
      `[경고] ${vehicleAssignments[0]?.shuttleName}(${shuttleRouteId}) 노선에서 버스를 생성하지 않고 넘어갑니다. (버스 생성 데이터가 이미 존재합니다.)`,
    );
  }
};

const createBusesForRoute = async (
  eventId: string,
  dailyEventId: string,
  shuttleRouteId: string,
  shuttleBusesToCreate: VehicleAssignment[],
  shuttleName: string,
  createCurrentTimeLog: (message: string) => void,
) => {
  await Promise.allSettled(
    shuttleBusesToCreate.map(async (vehicleAssignment) => {
      try {
        const body = {
          number: vehicleAssignment.vehicleNumber,
          type: BUS_TYPE,
          name: vehicleAssignment.vehicleName,
          phoneNumber: vehicleAssignment.driverPhoneNumber,
        };
        await postShuttleBus(eventId, dailyEventId, shuttleRouteId, body);

        createCurrentTimeLog(
          `[성공] ${shuttleName}(${shuttleRouteId}) 노선에 ${vehicleAssignment.vehicleName} 버스 생성 완료`,
        );
      } catch (error) {
        createCurrentTimeLog(
          `[실패] ${shuttleName}(${shuttleRouteId}) 노선에 ${vehicleAssignment.vehicleName} 버스 생성 실패: ${error}`,
        );
      }
    }),
  );
};

// Passenger assignment functions
const processPassengerAssignment = async (
  eventId: string,
  dailyEventId: string,
  createCurrentTimeLog: (message: string) => void,
  parsedItems: HandyPartySheetData[],
  vehicleAssignmentMap: Map<string, VehicleAssignment[]>,
  handyPartyReservations: ReservationViewEntity[],
  handyPartyShuttleRoutesMap: Map<string, AdminShuttleRoutesViewEntity>,
) => {
  createCurrentTimeLog('=== 승객 배차 단계 시작 ===');

  const createdShuttleBusList = await fetchCreatedShuttleBuses(
    eventId,
    dailyEventId,
    vehicleAssignmentMap,
    createCurrentTimeLog,
  );

  const { reservationBusMap, totalReservationsCountMap, shuttleRouteNameMap } =
    createAssignmentMaps(vehicleAssignmentMap, handyPartyReservations);

  await assignPassengersToBuses(
    parsedItems,
    handyPartyReservations,
    handyPartyShuttleRoutesMap,
    createdShuttleBusList,
    reservationBusMap,
    createCurrentTimeLog,
  );

  await executeBulkAssignments(
    eventId,
    dailyEventId,
    reservationBusMap,
    totalReservationsCountMap,
    shuttleRouteNameMap,
    createCurrentTimeLog,
  );

  createCurrentTimeLog('=== 승객 배차 단계 완료 ===');
};

const fetchCreatedShuttleBuses = async (
  eventId: string,
  dailyEventId: string,
  vehicleAssignmentMap: Map<string, VehicleAssignment[]>,
  createCurrentTimeLog: (message: string) => void,
): Promise<CreatedShuttleBusInfo[]> => {
  const shuttleRouteIds = Array.from(vehicleAssignmentMap.keys());

  return await Promise.all(
    shuttleRouteIds.map(async (shuttleRouteId) => {
      try {
        const shuttleBuses = await getShuttleBuses(
          eventId,
          dailyEventId,
          shuttleRouteId,
        );
        return {
          shuttleRouteId,
          shuttleBuses: shuttleBuses.map((shuttleBus) => ({
            shuttleBusId: shuttleBus.shuttleBusId,
            shuttleRouteId: shuttleBus.shuttleRouteId,
            busName: shuttleBus.busName,
          })),
        };
      } catch (error) {
        createCurrentTimeLog(
          `[경고] ${shuttleRouteId} 노선에서 버스를 조회할 수 없습니다. ${error}`,
        );
        return { shuttleRouteId, shuttleBuses: [] };
      }
    }),
  );
};

const createAssignmentMaps = (
  vehicleAssignmentMap: Map<string, VehicleAssignment[]>,
  handyPartyReservations: ReservationViewEntity[],
) => {
  const totalReservationsCountMap = new Map<string, number>();
  const shuttleRouteNameMap = new Map<string, string>();

  vehicleAssignmentMap.forEach((vehicleAssignments, shuttleRouteId) => {
    const totalReservationsForRoute = handyPartyReservations.filter(
      (reservation) =>
        reservation.shuttleRoute.shuttleRouteId === shuttleRouteId,
    ).length;
    totalReservationsCountMap.set(shuttleRouteId, totalReservationsForRoute);

    if (vehicleAssignments.length > 0) {
      shuttleRouteNameMap.set(
        shuttleRouteId,
        vehicleAssignments[0].shuttleName,
      );
    }
  });

  return {
    reservationBusMap: new Map<string, ReservationBusMap[]>(),
    totalReservationsCountMap,
    shuttleRouteNameMap,
  };
};

const assignPassengersToBuses = (
  parsedItems: HandyPartySheetData[],
  handyPartyReservations: ReservationViewEntity[],
  handyPartyShuttleRoutesMap: Map<string, AdminShuttleRoutesViewEntity>,
  createdShuttleBusList: CreatedShuttleBusInfo[],
  reservationBusMap: Map<string, ReservationBusMap[]>,
  createCurrentTimeLog: (message: string) => void,
) => {
  parsedItems.forEach((parsedItem) => {
    const { region, tripType, partyId } = parsedItem;
    const expectedShuttleName = `${HANDY_PARTY_PREFIX}_${region}_${tripType}`;
    const expectedShuttleBusName = `${HANDY_PARTY_PREFIX}_${region}_${tripType}_${partyId}호차`;

    const matchingShuttleRoute =
      handyPartyShuttleRoutesMap.get(expectedShuttleName);

    if (!matchingShuttleRoute) {
      createCurrentTimeLog(
        `[경고] 승객 배차 처리 단계: ${expectedShuttleName} 노선을 찾을 수 없습니다.`,
      );
      return;
    }

    assignPassengersForItem(
      parsedItem,
      matchingShuttleRoute,
      expectedShuttleBusName,
      createdShuttleBusList,
      reservationBusMap,
      handyPartyReservations,
      createCurrentTimeLog,
    );
  });
};

const assignPassengersForItem = (
  parsedItem: HandyPartySheetData,
  matchingShuttleRoute: AdminShuttleRoutesViewEntity,
  expectedShuttleBusName: string,
  createdShuttleBusList: CreatedShuttleBusInfo[],
  reservationBusMap: Map<string, ReservationBusMap[]>,
  handyPartyReservations: ReservationViewEntity[],
  createCurrentTimeLog: (message: string) => void,
) => {
  const { shuttleRouteId, name: shuttleName } = matchingShuttleRoute;
  const { passengerPhoneNumber, address } = parsedItem;

  while (parsedItem.count > 0) {
    const matchingReservation = findMatchingReservation(
      passengerPhoneNumber,
      address,
      shuttleName,
      parsedItem.count,
      handyPartyReservations,
    );

    if (!matchingReservation) {
      createCurrentTimeLog(
        `[경고] 승객 배차 처리 단계: ${shuttleName} 노선에서 해당하는 예약을 찾을 수 없습니다. 주소: ${address}, 연락처: ${passengerPhoneNumber}`,
      );
      return;
    }

    const shuttleBusId = findShuttleBusId(
      createdShuttleBusList,
      shuttleRouteId,
      expectedShuttleBusName,
    );

    addReservationToBusMap(
      reservationBusMap,
      shuttleRouteId,
      matchingReservation.reservationId,
      shuttleBusId,
    );

    removeReservationFromList(
      matchingReservation.reservationId,
      handyPartyReservations,
    );
    parsedItem.count -= matchingReservation.passengerCount;
  }
};

const findMatchingReservation = (
  passengerPhoneNumber: string,
  address: string,
  shuttleName: string,
  count: number,
  handyPartyReservations: ReservationViewEntity[],
): ReservationViewEntity | undefined => {
  return handyPartyReservations.find(
    (reservation) =>
      reservation.userPhoneNumber === passengerPhoneNumber &&
      reservation.metadata.desiredHubAddress === address &&
      reservation.shuttleRoute.name === shuttleName &&
      reservation.passengerCount <= count,
  );
};

const findShuttleBusId = (
  createdShuttleBusList: CreatedShuttleBusInfo[],
  shuttleRouteId: string,
  expectedShuttleBusName: string,
): string | null => {
  return (
    createdShuttleBusList
      .find(
        (createdShuttleBusItem) =>
          createdShuttleBusItem.shuttleRouteId === shuttleRouteId,
      )
      ?.shuttleBuses.find(
        (shuttleBus) => shuttleBus.busName === expectedShuttleBusName,
      )?.shuttleBusId ?? null
  );
};

const addReservationToBusMap = (
  reservationBusMap: Map<string, ReservationBusMap[]>,
  shuttleRouteId: string,
  reservationId: string,
  shuttleBusId: string | null,
) => {
  if (!reservationBusMap.has(shuttleRouteId)) {
    reservationBusMap.set(shuttleRouteId, []);
  }

  reservationBusMap.get(shuttleRouteId)!.push({
    reservationId,
    shuttleBusId,
  });
};

const removeReservationFromList = (
  reservationId: string,
  handyPartyReservations: ReservationViewEntity[],
) => {
  const index = handyPartyReservations.findIndex(
    (reservation) => reservation.reservationId === reservationId,
  );
  if (index !== -1) {
    handyPartyReservations.splice(index, 1);
  }
};

const executeBulkAssignments = async (
  eventId: string,
  dailyEventId: string,
  reservationBusMap: Map<string, ReservationBusMap[]>,
  totalReservationsCountMap: Map<string, number>,
  shuttleRouteNameMap: Map<string, string>,
  createCurrentTimeLog: (message: string) => void,
) => {
  await Promise.allSettled(
    Array.from(reservationBusMap.entries()).map(
      async ([shuttleRouteId, reservationBusList]) => {
        const validReservationBusList = reservationBusList.filter(
          (item) => item.shuttleBusId !== null,
        );

        const shuttleName = shuttleRouteNameMap.get(shuttleRouteId);
        if (validReservationBusList.length === 0) {
          createCurrentTimeLog(
            `[경고] ${shuttleName}(${shuttleRouteId}) 노선에서 유효한 버스 배차 데이터가 없습니다.`,
          );
          return Promise.resolve();
        }

        try {
          const body = {
            reservationShuttleBusMap: validReservationBusList.map((item) => ({
              reservationId: item.reservationId,
              shuttleBusId: item.shuttleBusId!,
            })),
          };
          await postBulkAssignBus(eventId, dailyEventId, shuttleRouteId, body);
          const totalCount = totalReservationsCountMap.get(shuttleRouteId) || 0;
          createCurrentTimeLog(
            `[성공] ${shuttleName}(${shuttleRouteId}) 노선에서 승객 배차 완료 (${validReservationBusList.length}/${totalCount}개 예약)`,
          );
        } catch (error) {
          createCurrentTimeLog(
            `[실패] ${shuttleName}(${shuttleRouteId}) 노선에서 승객 배차 실패: ${error}`,
          );
        }
      },
    ),
  );
};
