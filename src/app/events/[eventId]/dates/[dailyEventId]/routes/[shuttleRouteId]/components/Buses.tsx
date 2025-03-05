'use client';

import { busColumns } from '../table.type';
import BlueLink from '@/components/link/BlueLink';
import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import { useGetShuttleBuses } from '@/services/shuttleBus.service';
import { useMemo } from 'react';

interface Props {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
}

const Buses = ({ eventId, dailyEventId, shuttleRouteId }: Props) => {
  const { data: reservations, isLoading: isReservationLoading } =
    useGetReservationsWithPagination({
      eventId,
      dailyEventId,
      shuttleRouteId,
      reservationStatus: 'COMPLETE_PAYMENT',
    });

  const { data: buses, isLoading: isBusLoading } = useGetShuttleBuses(
    eventId,
    dailyEventId,
    shuttleRouteId,
  );

  const reservationsOfHandy = useMemo(() => {
    if (!reservations) {
      return null;
    }
    const allReservations = reservations.pages?.[0]?.reservations ?? [];
    return allReservations
      .filter(
        (reservation) =>
          reservation.handyStatus === 'ACCEPTED' &&
          reservation.shuttleBusId !== null,
      )
      .map((reservation) => ({
        shuttleBusId: reservation.shuttleBusId,
        handyPhoneNumber: reservation.userPhoneNumber,
        handyNickname: reservation.userNickname,
      }));
  }, [reservations]);

  const parsedBuses = useMemo(() => {
    if (!buses || !reservationsOfHandy) {
      return [];
    }
    return buses.map((bus) => {
      const reservationOfHandy = reservationsOfHandy.find(
        (reservation) => reservation.shuttleBusId === bus.shuttleBusId,
      );
      return {
        ...bus,
        eventId: eventId,
        dailyEventId: dailyEventId,
        shuttleRouteId: shuttleRouteId,
        handyPhoneNumber: reservationOfHandy?.handyPhoneNumber,
        handyNickname: reservationOfHandy?.handyNickname,
      };
    });
  }, [buses, eventId, dailyEventId, shuttleRouteId, reservationsOfHandy]);

  const busTable = useTable({
    data: parsedBuses,
    columns: busColumns,
  });

  const isLoading = isBusLoading || isReservationLoading;

  return (
    <>
      <Heading.h2 className="flex items-baseline gap-20">
        버스 목록 ({buses?.length ?? 0})
        <BlueLink href={`${shuttleRouteId}/buses/new`} className="text-14">
          추가하기
        </BlueLink>
      </Heading.h2>
      {isLoading && <div>Loading...</div>}
      {buses && <BaseTable table={busTable} />}
    </>
  );
};

export default Buses;
