'use client';

import useTable from '@/hooks/useTable';
import { useMemo, useState } from 'react';
import BaseTable from '@/components/table/BaseTable';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import { reservationColumns } from '../table.type';
import Toggle from '@/components/button/Toggle';
import BlueButton from '@/components/link/BlueButton';
import { sendHandyPartyConfirmed } from '@/services/solapi.service';

interface Props {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
  isHandyParty: boolean;
}

const ReservationTable = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
  isHandyParty,
}: Props) => {
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

  const delay = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleSendHandyPartyConfirmation = async () => {
    const isConfirmed = confirm(
      '핸디팟 확정 안내를 일괄 전송하시겠습니까?\n 모든 핸디팟 예약에 대해 안내가 전송됩니다.\n 최대 1분이 소요됩니다. 절대 사이트를 끄지 말아주세요.',
    );
    if (!isConfirmed) {
      return;
    }
    for (const reservation of validReservations) {
      await sendHandyPartyConfirmed(reservation.reservationId);
      await delay(300);
    }
    alert('핸디팟 확정 안내가 전송되었습니다.');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col pb-20 pt-12">
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
        <BlueButton
          disabled={!isHandyParty}
          onClick={handleSendHandyPartyConfirmation}
        >
          핸디팟 확정 안내 일괄 전송
        </BlueButton>
      </div>
      <BaseTable table={reservationTable} />
    </section>
  );
};

export default ReservationTable;
