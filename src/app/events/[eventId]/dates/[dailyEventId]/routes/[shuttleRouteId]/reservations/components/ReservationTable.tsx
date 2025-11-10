'use client';

import useTable from '@/hooks/useTable';
import { useCallback, useMemo, useState } from 'react';
import BaseTable from '@/components/table/BaseTable';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import { createReservationColumns } from '../table.type';
import Toggle from '@/components/button/Toggle';
import BlueButton from '@/components/link/BlueButton';
import useCancelMultipleReservations from '../hooks/useCancelMultipleReservations';
import { ReservationViewEntity } from '@/types/reservation.type';
import useConfirmMultipleReservations from '../hooks/useConfirmMultipleReservations';

interface Props {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
}

const ReservationTable = ({ eventId, dailyEventId, shuttleRouteId }: Props) => {
  const [isHideCanceled, setIsHideCanceled] = useState(false);

  const { data, isLoading } = useGetReservationsWithPagination({
    eventId,
    dailyEventId,
    shuttleRouteId,
  });

  const baseArray = useMemo(() => [], []);

  const reservations = useMemo(
    () =>
      data.pages?.[0]?.reservations.filter(
        (reservation) => reservation.shuttleBusId === null,
      ) ?? baseArray,
    [data],
  );

  const validReservations = useMemo(() => {
    return reservations.filter(
      (reservation) => reservation.reservationStatus !== 'CANCEL',
    );
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    if (!isHideCanceled) {
      return validReservations;
    }
    return reservations;
  }, [validReservations, isHideCanceled]);

  const [selectedReservations, setSelectedReservations] = useState<
    ReservationViewEntity[]
  >([]);
  const handleSelectReservation = useCallback(
    (reservation: ReservationViewEntity, isChecked: boolean) => {
      if (isChecked) {
        setSelectedReservations([...selectedReservations, reservation]);
      } else {
        setSelectedReservations(
          selectedReservations.filter(
            (r) => r.reservationId !== reservation.reservationId,
          ),
        );
      }
    },
    [selectedReservations],
  );
  const handleSelectAll = useCallback(
    (isChecked: boolean) => {
      if (isChecked) {
        setSelectedReservations(filteredReservations);
      } else {
        setSelectedReservations([]);
      }
    },
    [filteredReservations],
  );
  const handleClearSelect = useCallback(() => {
    setSelectedReservations([]);
  }, []);

  const cancelMultipleReservations = useCancelMultipleReservations({
    onSuccess: handleClearSelect,
  });
  const confirmMultipleReservations = useConfirmMultipleReservations({
    onSuccess: handleClearSelect,
  });

  const handleCancelMultipleReservations = useCallback(async () => {
    await cancelMultipleReservations(selectedReservations);
  }, [cancelMultipleReservations, selectedReservations]);
  const handleConfirmMultipleReservations = useCallback(async () => {
    await confirmMultipleReservations(selectedReservations);
  }, [confirmMultipleReservations, selectedReservations]);

  const reservationColumns = useMemo(
    () =>
      createReservationColumns({
        selectedReservations,
        onSelectReservation: handleSelectReservation,
        onSelectAll: handleSelectAll,
      }),
    [selectedReservations, handleSelectReservation, handleSelectAll],
  );

  const reservationTable = useTable({
    columns: reservationColumns,
    data: filteredReservations,
  });

  const totalNumberOfPeople = useMemo(() => {
    return validReservations.reduce((acc, reservation) => {
      return acc + reservation.passengerCount;
    }, 0);
  }, [validReservations]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col pb-20 pt-12">
      <div className="mb-12 flex items-center gap-12 rounded-4 bg-basic-grey-100 p-8 text-14">
        <BlueButton
          onClick={handleCancelMultipleReservations}
          disabled={selectedReservations.length === 0}
        >
          선택한 예약들 무산 처리하기
        </BlueButton>
        <BlueButton
          onClick={handleConfirmMultipleReservations}
          disabled={selectedReservations.length === 0}
        >
          선택한 예약들 확정 안내 발송하기
        </BlueButton>
      </div>
      <div className="flex items-center gap-12">
        <span className="text-14 font-400 text-basic-grey-700">
          유효한 예약 {validReservations.length}건 ({totalNumberOfPeople}인) /
          합계 {reservations.length}건
        </span>
        <Toggle
          label="취소된 예약 포함"
          value={isHideCanceled}
          setValue={() => setIsHideCanceled((prev) => !prev)}
        />
      </div>
      <BaseTable table={reservationTable} />
    </section>
  );
};

export default ReservationTable;
