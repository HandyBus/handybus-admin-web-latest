'use client';

import Stringifier from '@/utils/stringifier.util';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import EditHandyStatusDialog from '../[reservation_id]/components/EditHandyStatusDialog';
import BlueLink from '@/components/link/BlueLink';
import {
  useGetReservationsWithPagination,
  useGetShuttleBuses,
  usePostBulkAssignBus,
} from '@/services/shuttleOperation.service';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import { TripType } from '@/types/shuttleRoute.type';

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
  eventId: number;
  dailyEventId: number;
  shuttleRouteId: number;
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
              reservation.passengers.length;
          } else if (reservation.type === 'FROM_DESTINATION') {
            newBusWithSeats[busWithSeatIndex].fromDestinationFilledSeat +=
              reservation.passengers.length;
          } else {
            newBusWithSeats[busWithSeatIndex].toDestinationFilledSeat +=
              reservation.passengers.length;
            newBusWithSeats[busWithSeatIndex].fromDestinationFilledSeat +=
              reservation.passengers.length;
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
      const requiredSeat = reservation.passengers.length;
      const requiredSeatType = reservation.type;

      // 좌석이 충분한 버스 찾기
      const availableBusWithSeat = findAvailableBus(
        editingBusWithSeats,
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

      // 좌석 수 업데이트
      updateBusWithSeats(
        availableBusWithSeat.bus.shuttleBusId,
        requiredSeat,
        requiredSeatType,
      );
    });

    setEditingBusAndReservations(newEditingBusAndReservations);
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
    busId: number,
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
    shuttleBusId: number,
    buses: ShuttleBusesViewEntity[],
    reservation: ReservationViewEntity,
  ) => {
    const selectedBus = buses.find((bus) => bus.shuttleBusId === shuttleBusId);
    const reservationId = reservation.reservationId;
    let prevBusId: number | null = null;

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
      reservation.passengers.length,
      reservation.type,
    );
    // 기존에 있던 버스의 좌석 수 감소
    updateBusWithSeats(
      prevBusId,
      reservation.passengers.length * -1,
      reservation.type,
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <h2 className="text-24 font-500 pb-8 bg-[#e0e0e0] py-4 px-12 my-4 flex items-center">
        버스 배차 현황
        {isEditMode ? (
          <div className="flex items-center gap-4 ml-40">
            <button
              type="button"
              className="text-14 font-500 bg-primary rounded-md border border-grey-300 px-12 py-[3px]"
              onClick={handleAssignBus}
            >
              확인
            </button>
            <button
              type="button"
              className="text-14 font-500 bg-grey-100 rounded-md border border-grey-300 px-12 py-[3px]"
              onClick={() => setIsEditMode(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="text-14 font-500 bg-grey-100 rounded-md border border-grey-300 px-12 py-[3px] ml-16"
              onClick={handleFillUnassignedReservation}
            >
              배차되지 않은 승객 채우기
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="text-14 font-500 bg-grey-100 rounded-md ml-40 border border-grey-300 px-12 py-[3px]"
            onClick={() => {
              setIsEditMode(true);
              initEditing();
            }}
          >
            수정하기
          </button>
        )}
      </h2>
      <section className="flex flex-col gap-16">
        {/* 각 버스 매핑 */}
        {(isEditMode ? editingBusWithSeats : busWithSeats)?.map(
          (busWithSeat) => (
            <article
              key={busWithSeat.bus.shuttleBusId}
              className="flex flex-col gap-8"
            >
              <h3 className="flex items-center gap-12 bg-[#ebebeb] py-4 px-12">
                <p className="text-16 font-500 text-grey-900">
                  {busWithSeat.bus.busName}
                </p>
                <p className="text-14 font-500 text-grey-600">
                  {Stringifier.busType(busWithSeat.bus.busType)}
                </p>
                <p className="text-14 font-500 text-grey-500">
                  {busWithSeat.bus.busNumber}
                </p>
              </h3>
              {/* 버스 내 행 매핑 */}
              <div className="grid grid-cols-2 gap-8">
                <ul>
                  <h4 className="flex items-center gap-12 bg-[#f3f3f3] py-4 px-12 text-14 font-500">
                    콘서트행{' '}
                    <span className="text-14 font-500 text-grey-500 ml-12">
                      {`(${busWithSeat.toDestinationFilledSeat}/${busWithSeat.maxSeat})`}
                    </span>
                  </h4>
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
                  <h4 className="flex items-center gap-12 bg-[#f3f3f3] py-4 px-12 text-14 font-500">
                    귀가행
                    <span className="text-14 font-500 text-grey-500 ml-12">
                      {`(${busWithSeat.fromDestinationFilledSeat}/${busWithSeat.maxSeat})`}
                    </span>
                  </h4>
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
    shuttleBusId: number,
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
    <li className="flex items-center gap-20 border-b border-grey-300 py-4 px-12">
      <p className="text-14 font-500 text-grey-900">
        {reservation.userNickname}
      </p>
      <p className="text-14 font-400 text-grey-700">
        {reservation.userPhoneNumber}
      </p>
      <p className="text-14 font-400 text-grey-700">
        {reservation.passengers.length}인
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
            const shuttleBusId = Number(e.target.value);
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
      <div className="flex items-center gap-12 ml-auto">
        {reservation.handyStatus !== 'NOT_SUPPORTED' && (
          <p>
            <EditHandyStatusDialog response={reservation} />
          </p>
        )}
        <p>
          <BlueLink
            href={`/reservations/${reservation.shuttleRouteId}/${reservation.reservationId}`}
          >
            상세보기
          </BlueLink>
        </p>
      </div>
    </li>
  );
};

export default BusTable;
