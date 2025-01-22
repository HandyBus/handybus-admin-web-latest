'use client';

import useTable from '@/hooks/useTable';
import { useMemo } from 'react';
import { reservationColumns } from '../types/table.type';
import { toast } from 'react-toastify';
import BaseTable from '@/components/table/BaseTable';
import {
  useGetReservationsWithPagination,
  usePutReservation,
} from '@/services/shuttleOperation.service';

interface Props {
  eventId: number;
  dailyEventId: number;
  shuttleRouteId: number;
}

const ReservationTable = ({ eventId, dailyEventId, shuttleRouteId }: Props) => {
  const { data, isLoading } = useGetReservationsWithPagination({
    eventId,
    dailyEventId,
    shuttleRouteId,
    reservationStatus: 'COMPLETE_PAYMENT',
  });

  const baseArray = useMemo(() => [], []);

  const reservations = useMemo(
    () =>
      data.pages?.[0]?.reservations.filter(
        (reservation) => reservation.shuttleBusId === null,
      ) ?? baseArray,
    [data],
  );

  const reservationTable = useTable({
    columns: reservationColumns,
    data: reservations,
  });

  const { mutate: putReservation } = usePutReservation();

  const rejectAllSupportedHandy = async () => {
    const isConfirmed = confirm(
      '핸디 지원자들을 일괄 거절하시겠습니까? \n 모두에게 거절 알림톡이 전송됩니다.',
    );
    if (!isConfirmed) {
      return;
    }

    const reservationIds = reservations
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
    <section>
      <h2 className="text-24 font-500 pb-8 bg-[#e0e0e0] py-4 px-12 my-4 flex items-center">
        배차되지 않은 예약
        <span className="text-14 font-400 text-grey-700 ml-20">
          현재 유효한 예약만 표시됩니다.
        </span>
        <button
          onClick={rejectAllSupportedHandy}
          className="text-14 font-500 rounded-[4px] border border-grey-300 px-12 py-4 bg-grey-100 ml-24"
        >
          핸디 지원 일괄 거절
        </button>
      </h2>
      <BaseTable table={reservationTable} />
    </section>
  );
};

export default ReservationTable;
