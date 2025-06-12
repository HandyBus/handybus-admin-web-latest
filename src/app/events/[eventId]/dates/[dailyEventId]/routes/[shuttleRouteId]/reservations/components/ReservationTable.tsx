'use client';

import useTable from '@/hooks/useTable';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import BaseTable from '@/components/table/BaseTable';
import {
  useGetReservationsWithPagination,
  usePutReservation,
} from '@/services/reservation.service';
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

  const { mutate: putReservation } = usePutReservation();

  const rejectAllSupportedHandy = async () => {
    const isConfirmed = confirm(
      '핸디 지원자들을 일괄 거절하시겠습니까? \n 모두에게 거절 알림톡이 전송됩니다.',
    );
    if (!isConfirmed) {
      return;
    }

    const reservationIds = validReservations
      .filter((reservation) => reservation.handyStatus === 'SUPPORTED')
      .map((reservation) => reservation.reservationId);

    try {
      await Promise.all(
        reservationIds.map((reservationId) =>
          putReservation({
            reservationId,
            body: {
              handyStatus: 'DECLINED',
            },
          }),
        ),
      );
      toast.success('핸디 지원자들을 일괄 거절했습니다.');
    } catch {
      toast.error('오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col pb-20 pt-12">
      <Heading.h2 className="flex items-center gap-12">
        배차되지 않은 예약{' '}
        <span className="text-14 font-400 text-grey-700">
          유효한 예약 {validReservations.length}건 / 합계 {reservations.length}
          건
        </span>
        <Toggle
          label="취소된 예약 포함"
          value={isHideCanceled}
          setValue={() => setIsHideCanceled((prev) => !prev)}
        />
        <button
          onClick={rejectAllSupportedHandy}
          className="rounded-[4px] border border-grey-300 bg-notion-grey/20 px-12 py-[2px] text-14 font-500"
        >
          핸디 지원 일괄 거절
        </button>
      </Heading.h2>
      <BaseTable table={reservationTable} />
    </section>
  );
};

export default ReservationTable;
