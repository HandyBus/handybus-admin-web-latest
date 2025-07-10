'use client';

import { useEffect, useMemo, useState } from 'react';
import Heading from '@/components/text/Heading';
import {
  ClusteredRouteResult,
  CalculatedData,
  TripTypeWithRoundTrip,
  BusAndReservation,
  BusWithSeat,
} from './types/optimizer.type';
import { useGetRegionHubs } from '@/services/hub.service';
import { RegionHubsViewEntity } from '@/types/hub.type';
import Loading from '@/components/loading/Loading';
import useDrag from './hooks/useDrag';
import CalculatedDataAndMapView from './components/CalculatedDataAndMapView';
import EventPlaceSelect from './components/EventPlaceSelect';
import useCalculateOptimizedRoute from './hooks/useCalculateOptimizedRoute';
import BlueLink from '@/components/link/BlueLink';
import { ReservationViewEntity } from '@/types/reservation.type';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import Stringifier from '@/utils/stringifier.util';
import EditHandyStatusDialog from '@/components/dialog/EditHandyStatusDialog';
import { useGetShuttleBuses } from '@/services/shuttleBus.service';
import { useGetReservationsWithPagination } from '@/services/reservation.service';

/**
 * NOTE1 : 경로순서를 계산하여 배차하더라도, 현재 데이터베이스에서는 배차승객의 경로순서 속성이 없다.
 * 때문에 경로 순서를 계산하여 반영하더라도 데이터베이스에 순서가 반영되지 않는다.
 * 물론, 만들어지는 호차별 승객 데이터 배열은 경로 순서대로 반영이 될 수 있있는데, 순서가 보장되진 않는다.
 * 그래서 배차완료후 엑셀 명단을 추출해서 
 * 
 * NOTE2 : 왕복 예약 승객이 가는 편 오는 편이 다른 차량에 배정되는 경우가 있을 수 있다.
 * 왕복 예약 승객의 경우에는 하나의 예약에 TripType 이 왕복이므로
 * 가는 편 오는 편이 각각 다른 차량으로 배정할 수 없다.
 * 그러나 최근 택시팟의 경우에는 가는편 오는편을 따로 개설하도록 되었으므로 이 경우에 대해서는 걱정할 필요가없다.
 */

interface Props {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
}

const HandyPartyVehicleAssignment = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
}: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [calculatedData, setCalculatedData] = useState<CalculatedData[]>([]);
  const [clusteredData, setClusteredData] = useState<ClusteredRouteResult[]>(
    [],
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [eventPlace, setEventPlace] = useState<RegionHubsViewEntity | null>(
    null,
  );
  const [busAndReservations, setBusAndReservations] = useState<
    BusAndReservation[]
  >([]);
  const [busWithSeats, setBusWithSeats] = useState<BusWithSeat[]>([]);
  const [editingBusAndReservations, setEditingBusAndReservations] = useState<
    CalculatedData[]
  >([]);
  const [editingBusWithSeats, setEditingBusWithSeats] = useState<BusWithSeat[]>(
    [],
  );

  const { data } = useGetRegionHubs({
    options: {
      page: undefined,
      usageType: ['EVENT_LOCATION'],
    },
  });

  const { data: buses, isLoading: isBusesLoading } = useGetShuttleBuses(
    eventId,
    dailyEventId,
    shuttleRouteId,
  );

  const { data: reservationData, isLoading: isReservationsLoading } =
    useGetReservationsWithPagination({
      eventId,
      dailyEventId,
      shuttleRouteId,
      reservationStatus: 'COMPLETE_PAYMENT',
    });

  const baseArray = useMemo(() => [], []);
  const reservations = useMemo(
    () => reservationData.pages?.[0]?.reservations ?? baseArray,
    [reservationData],
  );
  const eventLocationHubs = useMemo(
    () => data?.pages.flatMap((page) => page.regionHubs),
    [data],
  );

  const RouteTripType = reservations[0]?.type as TripTypeWithRoundTrip;

  const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
    useDrag({
      setDraggedIndex,
      draggedIndex,
      setCalculatedData,
      calculatedData,
      setClusteredData,
    });

  const { handleCalculateOptimizedRoute, isLoading: isCalculatorLoading } =
    useCalculateOptimizedRoute({
      eventPlace,
      rawCalculatedData: calculatedData,
      tripType: RouteTripType,
      setCalculatedData,
      setClusteredData,
    });

  // 현재 배차 현황을 적용
  const initBusAndReservation = () => {
    if (!buses || !reservations) {
      return;
    }

    const newBusWithSeats: BusWithSeat[] = buses.map((bus) => ({
      bus,
      maxSeat: bus.busCapacity,
      toDestinationFilledSeat: 0,
      fromDestinationFilledSeat: 0,
    }));

    const newBusAndReservation: BusAndReservation[] = [];
    reservations.forEach((reservation) => {
      const bus = buses.find(
        (bus) => bus.shuttleBusId === reservation?.shuttleBusId,
      );
      if (bus) {
        newBusAndReservation.push({ bus, reservation });
        const busWithSeatIndex = newBusWithSeats.findIndex(
          (busWithSeat) => busWithSeat.bus.shuttleBusId === bus.shuttleBusId,
        );
        if (busWithSeatIndex !== -1) {
          if (reservation.type === 'TO_DESTINATION') {
            newBusWithSeats[busWithSeatIndex].toDestinationFilledSeat +=
              reservation.passengerCount;
          } else if (reservation.type === 'FROM_DESTINATION') {
            newBusWithSeats[busWithSeatIndex].fromDestinationFilledSeat +=
              reservation.passengerCount;
          } else {
            newBusWithSeats[busWithSeatIndex].toDestinationFilledSeat +=
              reservation.passengerCount;
            newBusWithSeats[busWithSeatIndex].fromDestinationFilledSeat +=
              reservation.passengerCount;
          }
        }
      }
    });

    console.log('newBusAndReservation', newBusAndReservation);
    setBusAndReservations(newBusAndReservation);
    setBusWithSeats(newBusWithSeats);
  };

  useEffect(() => {
    initBusAndReservation();
  }, [buses, reservations]);

  const initEditing = () => {
    // setEditingBusAndReservations(busAndReservations);
    // setCalculatedData(busAndReservations);
    setEditingBusWithSeats(busWithSeats);
  };

  const isBusAndReservationLoading = isBusesLoading || isReservationsLoading;

  // 배차되지 않은 승객 채우기
  const handleFillUnassignedReservation = (tripType: TripTypeWithRoundTrip) => {
    if (!buses || !reservations || !tripType) {
      return;
    }
    const unAssignedReservations = reservations.filter(
      (reservation) => reservation.shuttleBusId === null,
    );

    const newCalculatedData = [...calculatedData];
    let stagedBusWithSeats = [...editingBusWithSeats];

    unAssignedReservations.forEach((reservation) => {
      if (
        newCalculatedData
          .filter((item) => item.reservation.type === tripType)
          .find(
            (busAndReservation) =>
              busAndReservation.reservation.reservationId ===
              reservation.reservationId,
          )
      ) {
        return;
      }

      newCalculatedData.push({
        order: newCalculatedData.length,
        // bus: undefined,
        reservation,
      });
    });
    // 최종 업데이트된 상태 한번에 적용
    console.log('stagedBusWithSeats', stagedBusWithSeats);
    setCalculatedData(newCalculatedData);
    setEditingBusWithSeats(stagedBusWithSeats);
  };

  if (!data || !buses || !reservations)
    throw new Error('행사장소 데이터가 없습니다.');
  if (isBusAndReservationLoading) return <Loading />;
  return (
    <div className="p-4">
      <Heading.h2 className="flex items-baseline gap-20">
        핸디팟 배차 관리
        <BlueLink
          href={`/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/buses/new`}
          className="text-14"
          target="_blank"
          rel="noopener noreferrer"
        >
          버스 추가하기
        </BlueLink>
        {isEditMode ? (
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-md border border-grey-300 bg-notion-grey/20 px-12 py-[2px] text-14 font-500"
              onClick={() => {}}
            >
              확인
            </button>
            <button
              type="button"
              className="rounded-md border border-grey-300 bg-notion-grey/20 px-12 py-[2px] text-14 font-500"
              onClick={() => {
                setCalculatedData([]);
                setIsEditMode(false);
              }}
            >
              취소
            </button>
            <button
              type="button"
              className="ml-16 rounded-md border border-grey-300 bg-notion-grey/20 px-12 py-[2px] text-14 font-500"
              onClick={() => handleFillUnassignedReservation(RouteTripType)}
            >
              배차되지 않은 승객 채우기
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="rounded-md border border-grey-300 bg-notion-grey/20 px-12 py-[2px] text-14 font-500"
            onClick={() => {
              setIsEditMode(true);
              initEditing();
            }}
          >
            수정하기
          </button>
        )}
      </Heading.h2>

      {isEditMode && (
        <div className="flex items-baseline gap-12">
          <Heading.h5 className="whitespace-nowrap">행사장소</Heading.h5>
          <EventPlaceSelect
            eventPlace={eventPlace}
            setEventPlace={setEventPlace}
            eventLocationHubs={eventLocationHubs}
          />
          <button
            onClick={handleCalculateOptimizedRoute}
            className="whitespace-nowrap rounded-lg bg-red-500 p-4 text-14 font-500 text-white transition-colors disabled:cursor-not-allowed disabled:bg-grey-200"
            disabled={!eventPlace || isCalculatorLoading}
          >
            최적 경로 계산
          </button>{' '}
          <div className="text-gray-600 mt-4 whitespace-nowrap text-14 font-500">
            <p>
              <strong>현재 적용된 데이터:</strong> {calculatedData.length}개
              주소
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 mb-8 rounded-lg p-4"></div>
      {isCalculatorLoading && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Heading.h4>최적 경로 계산중...</Heading.h4>
          <Loading />
        </div>
      )}
      {!isCalculatorLoading && calculatedData.length > 0 && (
        <CalculatedDataAndMapView
          calculatedData={calculatedData}
          clusteredData={clusteredData}
          draggedIndex={draggedIndex}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          editingBusWithSeats={editingBusWithSeats}
          busWithSeats={busWithSeats}
          buses={buses ?? []}
          setEditingBusWithSeats={setEditingBusWithSeats}
          editingBusAndReservations={editingBusAndReservations}
          setEditingBusAndReservations={setEditingBusAndReservations}
        />
      )}

      {!isEditMode && (
        <section className="flex flex-col gap-16">
          {/* 각 버스 매핑 */}
          {busWithSeats?.map((busWithSeat) => (
            <article
              key={busWithSeat.bus.shuttleBusId}
              className="flex flex-col gap-8"
            >
              <Heading.h4
                backgroundColor="grey"
                className="flex items-center gap-12"
              >
                <span>{busWithSeat.bus.busName}</span>
                <span className="text-14 font-500 text-grey-600">
                  {Stringifier.busType(busWithSeat.bus.busType)}
                </span>
                <span className="text-14 font-500 text-grey-500">
                  {busWithSeat.bus.busNumber}
                </span>
              </Heading.h4>
              {/* 버스 내 행 매핑 */}
              <div className="grid grid-cols-2 gap-8">
                <ul>
                  <Heading.h5
                    backgroundColor="blue"
                    className="flex items-center gap-12"
                  >
                    <span>콘서트행</span>
                    <span className="ml-12 text-14 font-500 text-grey-500">
                      {`(${busWithSeat.toDestinationFilledSeat}/${busWithSeat.maxSeat})`}
                    </span>
                  </Heading.h5>
                  {/* 배차된 예약 매핑 */}
                  {busAndReservations.map((busAndReservation) => {
                    if (
                      busAndReservation.bus.shuttleBusId !==
                        busWithSeat.bus.shuttleBusId ||
                      busAndReservation.reservation.type === 'FROM_DESTINATION'
                    ) {
                      return;
                    }
                    return (
                      <PassengerItem
                        key={busAndReservation.reservation.reservationId}
                        busAndReservation={busAndReservation}
                        buses={buses ?? []}
                        isEditMode={isEditMode}
                        handleChangeBus={() => {}}
                      />
                    );
                  })}
                </ul>
                <ul>
                  <Heading.h5
                    backgroundColor="yellow"
                    className="flex items-center gap-12"
                  >
                    <span> 오는편</span>
                    <span className="ml-12 text-14 font-500 text-grey-500">
                      {`(${busWithSeat.fromDestinationFilledSeat}/${busWithSeat.maxSeat})`}
                    </span>
                  </Heading.h5>
                  {/* 배차된 예약 매핑 */}
                  {busAndReservations.map((busAndReservation) => {
                    if (
                      busAndReservation.bus.shuttleBusId !==
                        busWithSeat.bus.shuttleBusId ||
                      busAndReservation.reservation.type === 'TO_DESTINATION'
                    ) {
                      return;
                    }
                    return (
                      <PassengerItem
                        key={busAndReservation.reservation.reservationId}
                        busAndReservation={busAndReservation}
                        buses={buses ?? []}
                        isEditMode={isEditMode}
                        handleChangeBus={() => {}}
                      />
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default HandyPartyVehicleAssignment;

interface PassengerItemProps {
  busAndReservation: BusAndReservation;
  buses: ShuttleBusesViewEntity[];
  isEditMode: boolean;
  handleChangeBus: (
    shuttleBusId: string,
    buses: ShuttleBusesViewEntity[],
    reservation: ReservationViewEntity,
  ) => void;
}

const PassengerItem = ({
  busAndReservation,
  buses,
  isEditMode,
  handleChangeBus,
}: PassengerItemProps) => {
  const { reservation, bus } = busAndReservation;
  return (
    <li className="flex items-center gap-20 border-b border-grey-300 px-12 py-4">
      <p className="text-14 font-500 text-grey-900">
        {reservation.userNickname}
      </p>
      <p className="text-14 font-400 text-grey-700">
        {reservation.userPhoneNumber}
      </p>
      <p className="text-14 font-400 text-grey-700">
        {reservation.passengerCount}인
      </p>
      <p className="text-14 font-400 text-grey-700">
        {Stringifier.tripType(reservation.type)}
      </p>
      <p
        className={`text-14 font-400 ${
          reservation.handyStatus === 'ACCEPTED'
            ? 'text-primary-main'
            : reservation.handyStatus === 'SUPPORTED'
              ? 'text-grey-700'
              : 'text-grey-400'
        }`}
      >
        {Stringifier.handyStatus(reservation.handyStatus)}
      </p>
      {isEditMode && (
        <select
          className="text-14 font-400 text-grey-700"
          value={bus.shuttleBusId ?? ''}
          onChange={(e) => {
            const shuttleBusId = e.target.value;
            handleChangeBus(shuttleBusId, buses, reservation);
          }}
        >
          {buses?.map((bus) => (
            <option key={bus.shuttleBusId} value={bus.shuttleBusId}>
              {bus.busName}
            </option>
          ))}
        </select>
      )}
      <div className="ml-auto flex items-center gap-12">
        {reservation.handyStatus !== 'NOT_SUPPORTED' && (
          <p>
            <EditHandyStatusDialog response={reservation} />
          </p>
        )}
        <p>
          <BlueLink href={`/reservations/${reservation.reservationId}`}>
            상세보기
          </BlueLink>
        </p>
      </div>
    </li>
  );
};
