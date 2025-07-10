import HandyPartyMap from './HandyPartyMap';
import {
  ClusteredRouteResult,
  CalculatedData,
  BusWithSeat,
} from '../types/optimizer.type';
import Heading from '@/components/text/Heading';
import Stringifier from '@/utils/stringifier.util';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';
import EditHandyStatusDialog from '@/components/dialog/EditHandyStatusDialog';
import BlueLink from '@/components/link/BlueLink';
import { ReservationViewEntity } from '@/types/reservation.type';
import { SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';
import { TripType } from '@/types/shuttleRoute.type';

interface Props {
  calculatedData: CalculatedData[];
  clusteredData: ClusteredRouteResult[];
  draggedIndex: number | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
  editingBusWithSeats: BusWithSeat[];
  busWithSeats: BusWithSeat[];
  buses: ShuttleBusesViewEntity[];
  setEditingBusWithSeats: (value: SetStateAction<BusWithSeat[]>) => void;
  editingBusAndReservations: CalculatedData[];
  setEditingBusAndReservations: (busAndReservations: CalculatedData[]) => void;
}

const CalculatedDataAndMapView = ({
  calculatedData,
  clusteredData,
  draggedIndex,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  editingBusWithSeats,
  buses,
  setEditingBusWithSeats,
  editingBusAndReservations,
  setEditingBusAndReservations,
}: Props) => {
  const [minIndex, setMinIndex] = useState<number | null>(null);
  const [maxIndex, setMaxIndex] = useState<number | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const handleLoadPassengersIntoVehicle = (
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

  return (
    <div className="flex w-full gap-8">
      <div className="flex-1">
        <HandyPartyMap clusteredData={clusteredData} />
      </div>

      <div className="mt-4 max-h-[67vh] flex-1 overflow-y-scroll">
        <Heading.h4 className="overflow-hidden text-ellipsis whitespace-nowrap">
          경로 순서 (드래그로 순서 조정 가능)
        </Heading.h4>
        {calculatedData.map((item, index) => (
          <div
            key={`${item.reservation.reservationId}-${index}`}
            className={`p-3 border-gray-200 flex cursor-pointer items-center justify-between border-b transition-all duration-200 ${
              draggedIndex === index
                ? 'scale-95 bg-blue-50 opacity-50'
                : 'hover:bg-gray-50'
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex-1">
              <span className="font-semibold text-blue-600">{item.order}.</span>
              <span className="ml-4">{item.reservation.userNickname}</span>
              <span className="ml-4">{item.reservation.userPhoneNumber}</span>
              <span className="ml-4">{item.reservation.passengerCount}</span>
              <span className="ml-4">{item.reservation.type}</span>
              <span className="ml-4">
                {item.reservation.metadata?.desiredHubAddress}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Heading.h4>버스 배차 현황</Heading.h4>

        <div>
          <input
            type="number"
            value={minIndex ?? ''}
            onChange={(e) => setMinIndex(Number(e.target.value))}
            className="w-fit"
          />
          ~
          <input
            type="number"
            value={maxIndex ?? ''}
            onChange={(e) => setMaxIndex(Number(e.target.value))}
            className="w-fit"
          />
          <select
            onChange={(e) => setSelectedBusId(e.target.value)}
            value={selectedBusId ?? ''}
          >
            {buses.map((bus) => (
              <option key={bus.shuttleBusId} value={bus.shuttleBusId}>
                {bus.busName}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              handleLoadPassengersIntoVehicle()
            }
          >
            담기
          </button>
        </div>
        {editingBusWithSeats?.map((busWithSeat) => (
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
              <span className="text-14 font-500 text-grey-500">
                {`(${busWithSeat.toDestinationFilledSeat}/${busWithSeat.maxSeat})`}
              </span>
            </Heading.h4>

            <div>
              {/* 배차된 예약 매핑 */}
              {calculatedData.map((calculatedData) => {
                if (
                  calculatedData.bus?.shuttleBusId !==
                    busWithSeat.bus.shuttleBusId ||
                  calculatedData.reservation.type === 'FROM_DESTINATION'
                ) {
                  return;
                }
                return (
                  <HandyPartyPassengerItem
                    key={calculatedData.reservation.reservationId}
                    busAndReservation={calculatedData}
                    buses={buses ?? []}
                    handleChangeBus={() => {}}
                  />
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CalculatedDataAndMapView;

interface HandyPartyPassengerItemProps {
  busAndReservation: CalculatedData;
  buses: ShuttleBusesViewEntity[];
  handleChangeBus: (
    shuttleBusId: string,
    buses: ShuttleBusesViewEntity[],
    reservation: ReservationViewEntity,
  ) => void;
}

const HandyPartyPassengerItem = ({
  busAndReservation,
  buses,
  handleChangeBus,
}: HandyPartyPassengerItemProps) => {
  const { reservation } = busAndReservation;
  return (
    <li className="flex items-center gap-20 border-b border-grey-300 px-12 py-4">
      <button onClick={() => {}}>빼기</button>
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
