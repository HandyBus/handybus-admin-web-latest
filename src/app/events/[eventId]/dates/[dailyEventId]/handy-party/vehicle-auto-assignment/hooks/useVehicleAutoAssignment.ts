import { useState } from 'react';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import {
  usePostShuttleBus,
  usePostBulkAssignBus,
  getShuttleBuses,
} from '@/services/shuttleBus.service';
import { HANDY_PARTY_PREFIX } from '@/constants/common';
import { parseInputData } from '../parseInputData';
import {
  HandyPartySheetData,
  ParsedItemTracker,
  ReservationBusMap,
  VehicleAssignment,
} from '../types/type';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';

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

  const { mutateAsync: postShuttleBus } = usePostShuttleBus({});
  const { mutateAsync: postBulkAssignBus } = usePostBulkAssignBus({});

  const handyPartyShuttleRoutesMap = new Map(
    shuttleRoutes
      ?.filter((shuttleRoute) => shuttleRoute.name.includes(HANDY_PARTY_PREFIX))
      .map((shuttleRoute) => [shuttleRoute.name, shuttleRoute]) || [],
  );

  const handyPartyReservations =
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

  /**
   * 버스 생성 단계
   * @param vehicleAssignmentMap 노선당 차량 정보 데이터
   *
   * 1. 노선별 생선된 버스 목록 조회 (API Call N번)
   * 2. 만들어야 할 버스 목록과 생성된 버스 목록 비교해 만들어지지 않은 버스를 추림
   * 3. 만들어지지 않은 버스 목록을 버스 생성 (API Call N번)
   */
  const processBusCreation = async (
    vehicleAssignmentMap: Map<string, VehicleAssignment[]>,
  ) => {
    for (const [shuttleRouteId, vehicleAssignments] of vehicleAssignmentMap) {
      const shuttleBuses = await getShuttleBuses(
        eventId,
        dailyEventId,
        shuttleRouteId,
      );

      const shuttleBusesMap = new Map(
        shuttleBuses.map((shuttleBus) => [shuttleBus.busName, shuttleBus]),
      );

      const shuttleBusesToCreate = vehicleAssignments.filter(
        (vehicleAssignment) =>
          !shuttleBusesMap.has(vehicleAssignment.vehicleName),
      );

      if (shuttleBusesToCreate.length > 0) {
        await Promise.allSettled(
          shuttleBusesToCreate.map(async (vehicleAssignment) => {
            try {
              await postShuttleBus({
                eventId,
                dailyEventId,
                shuttleRouteId,
                body: {
                  number: vehicleAssignment.vehicleNumber,
                  type: 'STARIA_7',
                  name: vehicleAssignment.vehicleName,
                  phoneNumber: vehicleAssignment.driverPhoneNumber,
                },
              });

              createCurrentTimeLog(
                `[성공] ${vehicleAssignmentMap.get(shuttleRouteId)?.[0]?.shuttleName}(${shuttleRouteId}) 노선에 ${vehicleAssignment.vehicleName} 버스 생성 완료`,
              );
            } catch (error) {
              createCurrentTimeLog(
                `[실패] ${vehicleAssignmentMap.get(shuttleRouteId)?.[0]?.shuttleName}(${shuttleRouteId}) 노선에 ${vehicleAssignment.vehicleName} 버스 생성 실패: ${error}`,
              );
            }
          }),
        );
      } else {
        createCurrentTimeLog(
          `[경고] ${vehicleAssignmentMap.get(shuttleRouteId)?.[0]?.shuttleName}(${shuttleRouteId}) 노선에서 버스를 생성하지 않고 넘어갑니다. (버스 생성 데이터가 이미 존재합니다.)`,
        );
      }
    }
  };

  /**
   * 승객 배차 단계
   * @param parsedItems 타다 시트 데이터
   * @param vehicleAssignmentMap 노선당 차량 정보 데이터
   *
   * 0. 각 shuttleRoute별로 실제 어드민에서 노선별 생성된 버스 목록을 조회
   * 1. 파싱된 데이터를 순회한다. 순회하면서 각 행에서 해당하는 shuttleRouteId 에 해당하는 승객의 reservationId를 찾는다.
   * 2A. currentReservationId에서 passengerCount 가 2이상인 경우에 임시 자료구조를 확인한다. 거기에 똑같은 항목들이 존재하는지 확인한다. (노선이름, 주소, 연락처, partyId 로 찾기)
   * 2A-1 자료구조에 저장된 항목들의 갯수의 합 +1이 현재 currentReservationId 의 passengerCount 보다 작으면 자료구조에 추가하고 다음 parsedItem 으로 넘어간다.
   * 2A-2 자료구조에 저장된 항목들의 갯수의 합 +1 이 현재 currentReservationId 의 passengerCount 와 같으면 배차 처리를 한다. 자료구조에 저장된 항목들 (shuttleName, address, passengerPhoneNumber, partyId) 가 모두 같은 항목들을 passengerCount 만큼 삭제한다.
   * 2B. currentReservationId에서 passengerCount 가 1인 경우, reservationId에 배차처리를 한다.
   * (고려했던 사항) 파싱단계에서 노선, 연락처, 주소가 같은 항목들을 미리 묶어두기. -> 적용하더라도 기대한만큼 간단하지 않음. 같은 노선, 연락처, 주소를 가진 항목이어도 다른 예약일 수 있다. 예를들어 에약 A (2명) 예약 B (1명) 이 있다고햇을때 파싱단계에서 같은 항목으로 3명 묶어두더라도, 실제 배차단계에서 A 예약 2명을 배차처리하고 1명을 예약 B로 배차해야하는데 이를 분간하고 처리하는데 복잡하게 되는건 마찬가지다.
   */
  const processPassengerAssignment = async (
    parsedItems: HandyPartySheetData[],
    vehicleAssignmentMap: Map<string, VehicleAssignment[]>,
  ) => {
    createCurrentTimeLog('=== 각 노선별 생성된 버스 목록 조회 중 ===');
    const shuttleRouteIds = Array.from(vehicleAssignmentMap.keys());
    const createdShuttleBusList = await Promise.all(
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
          return {
            shuttleRouteId,
            shuttleBuses: [],
          };
        }
      }),
    );

    createCurrentTimeLog('=== 각 노선별 생성된 버스 목록 조회 완료 ===');

    let parsedItemTracker: ParsedItemTracker[] = [];
    const reservationBusMap: Map<string, ReservationBusMap[]> = new Map();
    const totalReservationsCountMap: Map<string, number> = new Map();
    const shuttleRouteNameMap: Map<string, string> = new Map();

    // 각 노선별 전체 예약 개수와 노선명을 미리 계산
    vehicleAssignmentMap.forEach((vehicleAssignments, shuttleRouteId) => {
      const totalReservationsForRoute = handyPartyReservations.filter(
        (reservation) =>
          reservation.shuttleRoute.shuttleRouteId === shuttleRouteId,
      ).length;
      totalReservationsCountMap.set(shuttleRouteId, totalReservationsForRoute);

      // 첫 번째 vehicleAssignment에서 shuttleName 가져오기
      if (vehicleAssignments.length > 0) {
        shuttleRouteNameMap.set(
          shuttleRouteId,
          vehicleAssignments[0].shuttleName,
        );
      }
    });

    createCurrentTimeLog('=== 노선별 승객 배차 시작 ===');
    console.log('👍🏻 parsedItems', parsedItems);
    parsedItems.forEach((parsedItem) => {
      const { region, tripType, passengerPhoneNumber, address, partyId } =
        parsedItem;
      // debugger;
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

      const { shuttleRouteId, name: shuttleName } = matchingShuttleRoute;

      const matchingReservation = handyPartyReservations.find(
        (reservation) =>
          reservation.userPhoneNumber === passengerPhoneNumber &&
          reservation.metadata.desiredHubAddress === address &&
          reservation.shuttleRoute.name === shuttleName,
      );
      console.log('👍🏻 matchingReservation', matchingReservation);

      if (!matchingReservation) {
        createCurrentTimeLog(
          `[경고] 승객 배차 처리 단계: ${expectedShuttleName} 노선에서 해당하는 예약을 찾을 수 없습니다. 주소: ${address}, 연락처: ${passengerPhoneNumber}`,
        );
        return;
      }

      const { passengerCount, reservationId } = matchingReservation;

      if (passengerCount >= 2) {
        const existingTrackers = parsedItemTracker.filter(
          (tracker) =>
            tracker.shuttleName === shuttleName &&
            tracker.parsedItem.address === address &&
            tracker.parsedItem.passengerPhoneNumber === passengerPhoneNumber &&
            tracker.parsedItem.partyId === partyId,
        );

        if (existingTrackers.length < passengerCount - 1) {
          parsedItemTracker.push({
            parsedItem,
            shuttleRouteId,
            shuttleName,
          });
          return;
        }

        if (existingTrackers.length === passengerCount - 1) {
          let removedCount = 0;
          parsedItemTracker = parsedItemTracker.filter((tracker) => {
            const shouldRemove =
              removedCount < passengerCount &&
              tracker.shuttleName === shuttleName &&
              tracker.parsedItem.address === address &&
              tracker.parsedItem.passengerPhoneNumber ===
                passengerPhoneNumber &&
              tracker.parsedItem.partyId === partyId;

            if (shouldRemove) {
              removedCount++;
              return false;
            }
            return true;
          });

          const reservationBusItem: ReservationBusMap = {
            reservationId,
            shuttleBusId:
              createdShuttleBusList
                .find((createdShuttleBusItem) => {
                  return (
                    createdShuttleBusItem.shuttleRouteId === shuttleRouteId
                  );
                })
                ?.shuttleBuses.find(
                  (shuttleBus) => shuttleBus.busName === expectedShuttleBusName,
                )?.shuttleBusId ?? null,
          };

          if (!reservationBusMap.has(shuttleRouteId)) {
            reservationBusMap.set(shuttleRouteId, []);
          }
          reservationBusMap.get(shuttleRouteId)!.push(reservationBusItem);

          handyPartyReservations.splice(
            handyPartyReservations.findIndex(
              (reservation) => reservation.reservationId === reservationId,
            ),
            1,
          );
          console.log(
            '탑승자2인이상예약 하나 배차',
            reservationBusItem,
            partyId,
            '남은 handyPartyReservations',
            handyPartyReservations,
          );
        }
      } else {
        const reservationBusItem: ReservationBusMap = {
          reservationId,
          shuttleBusId:
            createdShuttleBusList
              .find((createdShuttleBusItem) => {
                return createdShuttleBusItem.shuttleRouteId === shuttleRouteId;
              })
              ?.shuttleBuses.find(
                (shuttleBus) => shuttleBus.busName === expectedShuttleBusName,
              )?.shuttleBusId ?? null,
        };

        if (!reservationBusMap.has(shuttleRouteId)) {
          reservationBusMap.set(shuttleRouteId, []);
        }
        reservationBusMap.get(shuttleRouteId)!.push(reservationBusItem);

        handyPartyReservations.splice(
          handyPartyReservations.findIndex(
            (reservation) => reservation.reservationId === reservationId,
          ),
          1,
        );
        console.log(
          '탑승자1인예약 하나 배차',
          reservationBusItem,
          partyId,
          '남은 handyPartyReservations',
          handyPartyReservations,
        );
      }
    });

    if (parsedItemTracker.length > 0) {
      parsedItemTracker.forEach((parsedItemTrackerItem) => {
        const { shuttleRouteId, shuttleName, parsedItem } =
          parsedItemTrackerItem;
        const { region, tripType, partyId } = parsedItem;
        const expectedShuttleBusName = `${HANDY_PARTY_PREFIX}_${region}_${tripType}_${partyId}호차`;
        const matchingReservation = handyPartyReservations.find(
          (reservation) =>
            reservation.shuttleRoute.shuttleRouteId === shuttleRouteId,
        );

        if (matchingReservation) {
          const { passengerCount, reservationId } = matchingReservation;
          if (passengerCount >= 2) {
            const reservationBusItem: ReservationBusMap = {
              reservationId,
              shuttleBusId:
                createdShuttleBusList
                  .find((createdShuttleBusItem) => {
                    return (
                      createdShuttleBusItem.shuttleRouteId === shuttleRouteId
                    );
                  })
                  ?.shuttleBuses.find(
                    (shuttleBus) =>
                      shuttleBus.busName === expectedShuttleBusName,
                  )?.shuttleBusId ?? null,
            };

            if (!reservationBusMap.has(shuttleRouteId)) {
              reservationBusMap.set(shuttleRouteId, []);
            }
            reservationBusMap.get(shuttleRouteId)!.push(reservationBusItem);

            handyPartyReservations.splice(
              handyPartyReservations.findIndex(
                (reservation) => reservation.reservationId === reservationId,
              ),
              1,
            );
          }
        } else {
          createCurrentTimeLog(
            `[경고] 승객 배차 처리 단계: ${shuttleName} 노선에서 해당하는 예약을 찾을 수 없습니다. 주소: ${parsedItem.address}, 연락처: ${parsedItem.passengerPhoneNumber}`,
          );
        }
      });
    }

    console.log('👍🏻 reservationBusMap', reservationBusMap);
    console.log('parsedItemTracker', parsedItemTracker);
    await Promise.allSettled(
      Array.from(reservationBusMap.entries()).map(
        async ([shuttleRouteId, reservationBusList]) => {
          const validReservationBusList = reservationBusList.filter(
            (item) => item.shuttleBusId !== null,
          );
          console.log(
            '👍🏻shuttleRouteId',
            shuttleRouteId,
            '👍🏻 reservationBusList',
            reservationBusList,
            '👍🏻 validReservationBusList',
            validReservationBusList,
          );
          if (validReservationBusList.length === 0) {
            createCurrentTimeLog(
              `[경고] ${shuttleRouteId} 노선에서 유효한 버스 배차 데이터가 없습니다.`,
            );
            return Promise.resolve();
          }

          try {
            await postBulkAssignBus({
              eventId,
              dailyEventId,
              shuttleRouteId,
              body: {
                reservationShuttleBusMap: validReservationBusList.map(
                  (item) => ({
                    reservationId: item.reservationId,
                    shuttleBusId: item.shuttleBusId!,
                  }),
                ),
              },
            });
            createCurrentTimeLog(
              `[성공] ${shuttleRouteNameMap.get(shuttleRouteId)}(${shuttleRouteId}) 노선에서 승객 배차 완료 (${validReservationBusList.length}/${totalReservationsCountMap.get(shuttleRouteId)}개 예약)`,
            );
          } catch (error) {
            createCurrentTimeLog(
              `[실패] ${shuttleRouteNameMap.get(shuttleRouteId)}(${shuttleRouteId}) 노선에서 승객 배차 실패: ${error}`,
            );
          }
        },
      ),
    );
  };

  /**
   * 자동 배차 처리 함수
   * @param inputText 타다 시트 데이터
   *
   * 1. 타다 시트 데이터 파싱
   * 2. 노선당 차량 정보 데이터 생성
   * 3. 버스 생성
   * 4. 승객 배차
   */
  const handleAutoAssignment = async (inputText: string) => {
    setIsProcessing(true);
    createCurrentTimeLog('=== 시작하기 버튼 클릭 ===');

    createCurrentTimeLog('=== 타다 시트 데이터 불러오는 중 ===');
    const parsed: HandyPartySheetData[] = parseInputData({
      text: inputText,
      dailyEventDate,
      createCurrentTimeLog,
    });
    if (parsed.length === 0) {
      alert('유효한 주소 데이터가 없습니다.');
      createCurrentTimeLog(
        '유효한 주소 데이터가 없습니다. 타다 시트 데이터를 다시 복사하세요.',
      );
      return;
    }
    createCurrentTimeLog('=== 타다 시트 데이터 불러오기 완료 ===');

    createCurrentTimeLog('=== 노선당 차량 정보 데이터 생성 중 ===');
    const vehicleAssignmentMap = new Map<string, VehicleAssignment[]>();
    parsed.forEach((parsedItem) => {
      const { region, tripType, partyId, vehicleNumber, driverPhoneNumber } =
        parsedItem;

      const expectedShuttleName = `${HANDY_PARTY_PREFIX}_${region}_${tripType}`;

      const matchingShuttleRoute =
        handyPartyShuttleRoutesMap.get(expectedShuttleName);

      if (matchingShuttleRoute) {
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

        if (routeArray && !isVehicleCreated) routeArray.push(vehicleAssignment);
      } else {
        createCurrentTimeLog(
          `[경고] ${expectedShuttleName} 노선을 찾을 수 없습니다. 해당 노선의 차량정보를 생성하지 않고 넘어갑니다.`,
        );
      }
    });
    createCurrentTimeLog(`=== 노선당 차량 정보 데이터 생성 완료 ===`);

    createCurrentTimeLog('=== 버스 생성 단계 시작 ===');
    await processBusCreation(vehicleAssignmentMap);
    createCurrentTimeLog('=== 버스 생성 단계 완료 ===');

    createCurrentTimeLog('=== 승객 배차 단계 시작 ===');
    await processPassengerAssignment(parsed, vehicleAssignmentMap);
    createCurrentTimeLog('=== 승객 배차 단계 완료 ===');
    setIsProcessing(false);
  };

  return {
    isProcessing,
    isLoadingReservations,
    isErrorReservations,
    handyPartyReservations,
    handleAutoAssignment,
  };
};
