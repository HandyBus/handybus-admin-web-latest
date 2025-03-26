'use client';

import Stringifier from '@/utils/stringifier.util';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import EditHandyStatusDialog from '@/components/dialog/EditHandyStatusDialog';
import BlueLink from '@/components/link/BlueLink';
import { usePostBulkAssignBus } from '@/services/shuttleBus.service';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import { TripType } from '@/types/shuttleRoute.type';
import Heading from '@/components/text/Heading';
import { useGetShuttleBuses } from '@/services/shuttleBus.service';
type BusAndReservation = {
  bus: ShuttleBusesViewEntity;
  reservation: ReservationViewEntity;
};

type BusWithSeat = {
  bus: ShuttleBusesViewEntity;
  maxSeat: number;
  toDestinationFilledSeat: number;
  fromDestinationFilledSeat: number;
};

interface Props {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
}

const BusTable = ({ eventId, dailyEventId, shuttleRouteId }: Props) => {
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

  const isLoading = isBusesLoading || isReservationsLoading;

  const baseArray = useMemo(() => [], []);
  const reservations = useMemo(
    () => reservationData.pages?.[0]?.reservations ?? baseArray,
    [reservationData],
  );

  const assignBusMutation = usePostBulkAssignBus({
    onSuccess: () => {
      setIsEditMode(false);
      initBusAndReservation();
    },
    onError: () => {
      toast.error('배차에 실패했습니다.');
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [busAndReservations, setBusAndReservations] = useState<
    BusAndReservation[]
  >([]);
  const [busWithSeats, setBusWithSeats] = useState<BusWithSeat[]>([]);
  const [editingBusAndReservations, setEditingBusAndReservations] = useState<
    BusAndReservation[]
  >([]);
  const [editingBusWithSeats, setEditingBusWithSeats] = useState<BusWithSeat[]>(
    [],
  );

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
    setBusAndReservations(newBusAndReservation);
    setBusWithSeats(newBusWithSeats);
  };

  useEffect(() => {
    initBusAndReservation();
  }, [buses, reservations]);

  const initEditing = () => {
    setEditingBusAndReservations(busAndReservations);
    setEditingBusWithSeats(busWithSeats);
  };

  // 배차되지 않은 승객 채우기
  const handleFillUnassignedReservation = () => {
    if (!buses || !reservations) {
      return;
    }
    const unAssignedReservations = reservations.filter(
      (reservation) => reservation.shuttleBusId === null,
    );

    const newEditingBusAndReservations = [...editingBusAndReservations];
    let stagedBusWithSeats = [...editingBusWithSeats];

    unAssignedReservations.forEach((reservation) => {
      if (
        newEditingBusAndReservations.find(
          (busAndReservation) =>
            busAndReservation.reservation.reservationId ===
            reservation.reservationId,
        )
      ) {
        return;
      }
      const requiredSeat = reservation.passengerCount;
      const requiredSeatType = reservation.type;
      // 좌석이 충분한 버스 찾기
      const availableBusWithSeat = findAvailableBus(
        stagedBusWithSeats,
        requiredSeat,
        requiredSeatType,
      );

      if (!availableBusWithSeat) {
        return;
      }

      newEditingBusAndReservations.push({
        bus: availableBusWithSeat.bus,
        reservation,
      });

      // 직접 지역 변수를 업데이트하여 다음 순회에 반영
      stagedBusWithSeats = stagedBusWithSeats.map((busWithSeat) =>
        busWithSeat.bus.shuttleBusId === availableBusWithSeat.bus.shuttleBusId
          ? {
              ...busWithSeat,
              ...(requiredSeatType === 'TO_DESTINATION' ||
              requiredSeatType === 'ROUND_TRIP'
                ? {
                    toDestinationFilledSeat:
                      busWithSeat.toDestinationFilledSeat + requiredSeat,
                  }
                : {}),
              ...(requiredSeatType === 'FROM_DESTINATION' ||
              requiredSeatType === 'ROUND_TRIP'
                ? {
                    fromDestinationFilledSeat:
                      busWithSeat.fromDestinationFilledSeat + requiredSeat,
                  }
                : {}),
            }
          : busWithSeat,
      );
    });

    // 최종 업데이트된 상태 한번에 적용
    setEditingBusAndReservations(newEditingBusAndReservations);
    setEditingBusWithSeats(stagedBusWithSeats);
  };

  // 좌석이 충분한 버스 찾기
  const findAvailableBus = (
    busWithSeats: BusWithSeat[],
    requiredSeat: number,
    seatType: TripType,
  ) => {
    return busWithSeats.find((busWithSeat) => {
      const { toDestinationFilledSeat, fromDestinationFilledSeat, maxSeat } =
        busWithSeat;

      switch (seatType) {
        case 'TO_DESTINATION':
          return toDestinationFilledSeat + requiredSeat <= maxSeat;
        case 'FROM_DESTINATION':
          return fromDestinationFilledSeat + requiredSeat <= maxSeat;
        default:
          return (
            toDestinationFilledSeat + requiredSeat <= maxSeat &&
            fromDestinationFilledSeat + requiredSeat <= maxSeat
          );
      }
    });
  };

  // 버스 좌석 업데이트
  const updateBusWithSeats = (
    busId: string,
    requiredSeat: number,
    seatType: TripType,
  ) => {
    setEditingBusWithSeats((prev) =>
      prev.map((busWithSeat) =>
        busWithSeat.bus.shuttleBusId === busId
          ? {
              ...busWithSeat,
              ...(seatType === 'TO_DESTINATION' || seatType === 'ROUND_TRIP'
                ? {
                    toDestinationFilledSeat:
                      busWithSeat.toDestinationFilledSeat + requiredSeat,
                  }
                : {}),
              ...(seatType === 'FROM_DESTINATION' || seatType === 'ROUND_TRIP'
                ? {
                    fromDestinationFilledSeat:
                      busWithSeat.fromDestinationFilledSeat + requiredSeat,
                  }
                : {}),
            }
          : busWithSeat,
      ),
    );
  };

  // 배차 확인 핸들러
  const handleAssignBus = () => {
    const confirm = window.confirm('현재 배차 현황을 적용하시겠습니까?');
    if (!confirm) {
      return;
    }

    const body = editingBusAndReservations.map((busAndReservation) => ({
      reservationId: busAndReservation.reservation.reservationId,
      shuttleBusId: busAndReservation.bus.shuttleBusId,
    }));

    assignBusMutation.mutate({
      eventId,
      dailyEventId,
      shuttleRouteId,
      body: { reservationShuttleBusMap: body },
    });
  };

  // 버스 변경
  const handleChangeBus = (
    shuttleBusId: string,
    buses: ShuttleBusesViewEntity[],
    reservation: ReservationViewEntity,
  ) => {
    const selectedBus = buses.find((bus) => bus.shuttleBusId === shuttleBusId);
    const reservationId = reservation.reservationId;
    let prevBusId: string | null = null;

    const newEditingBusAndReservations = editingBusAndReservations.map(
      (busAndReservation) => {
        if (
          busAndReservation.reservation.reservationId === reservationId &&
          selectedBus
        ) {
          prevBusId = busAndReservation.bus.shuttleBusId;
          const newBusAndReservation = {
            ...busAndReservation,
            bus: selectedBus,
          };
          return newBusAndReservation;
        }
        return busAndReservation;
      },
    );

    if (!prevBusId) {
      toast.error('오류가 발생했습니다.');
      return;
    }

    setEditingBusAndReservations(structuredClone(newEditingBusAndReservations));

    // 이동되는 버스의 좌석 수 추가
    updateBusWithSeats(
      shuttleBusId,
      reservation.passengerCount,
      reservation.type,
    );
    // 기존에 있던 버스의 좌석 수 감소
    updateBusWithSeats(
      prevBusId,
      reservation.passengerCount * -1,
      reservation.type,
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col">
      <Heading.h2 className="flex items-baseline gap-20">
        버스 배차 현황
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
              onClick={handleAssignBus}
            >
              확인
            </button>
            <button
              type="button"
              className="rounded-md border border-grey-300 bg-notion-grey/20 px-12 py-[2px] text-14 font-500"
              onClick={() => setIsEditMode(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="ml-16 rounded-md border border-grey-300 bg-notion-grey/20 px-12 py-[2px] text-14 font-500"
              onClick={handleFillUnassignedReservation}
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
      <section className="flex flex-col gap-16">
        {/* 각 버스 매핑 */}
        {(isEditMode ? editingBusWithSeats : busWithSeats)?.map(
          (busWithSeat) => (
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
                  {(isEditMode
                    ? editingBusAndReservations
                    : busAndReservations
                  ).map((busAndReservation) => {
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
                        handleChangeBus={handleChangeBus}
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
                  {(isEditMode
                    ? editingBusAndReservations
                    : busAndReservations
                  ).map((busAndReservation) => {
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
                        handleChangeBus={handleChangeBus}
                      />
                    );
                  })}
                </ul>
              </div>
            </article>
          ),
        )}
      </section>
    </section>
  );
};

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

export default BusTable;
