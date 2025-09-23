'use client';

import useTable from '@/hooks/useTable';
import { useMemo, useState } from 'react';
import BaseTable from '@/components/table/BaseTable';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import Heading from '@/components/text/Heading';
import { reservationColumns } from '../table.type';
import Toggle from '@/components/button/Toggle';

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
      <Heading.h2 className="flex items-center gap-12">
        <span className="text-14 font-400 text-basic-grey-700">
          유효한 예약 {validReservations.length}건 ({totalNumberOfPeople}인) /
          합계 {reservations.length}건
        </span>
        <Toggle
          label="취소된 예약 포함"
          value={isHideCanceled}
          setValue={() => setIsHideCanceled((prev) => !prev)}
        />
      </Heading.h2>
      <BaseTable table={reservationTable} />
    </section>
  );
};

export default ReservationTable;
