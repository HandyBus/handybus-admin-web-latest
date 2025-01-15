'use client';

import useTable from '@/hooks/useTable';
import { getReservations } from '@/services/v2/reservations.services';
import { useQuery } from '@tanstack/react-query';
import { busColumns, reservationColumns } from './types/table.type';
import BaseTable from '@/components/table/BaseTable';
import { getBuses } from '@/services/v2/shuttleBus.services';
import { useMemo, useState } from 'react';
import {
  Dialog,
  Description,
  DialogTitle,
  DialogPanel,
} from '@headlessui/react';

interface Props {
  params: {
    route_id: string;
  };
  searchParams: {
    eventId: string;
    dailyEventId: string;
  };
}

const Page = ({ params, searchParams }: Props) => {
  const eventId = Number(searchParams.eventId);
  const dailyEventId = Number(searchParams.dailyEventId);
  const routeId = Number(params.route_id);

  const { data: buses } = useQuery({
    queryKey: ['bus', eventId, dailyEventId, routeId],
    queryFn: async () => await getBuses(eventId, dailyEventId, routeId),
  });

  const { data } = useQuery({
    queryKey: ['reservation', routeId],
    queryFn: async () =>
      await getReservations({
        // eventId,
        // dailyEventId,
        shuttleRouteId: routeId,
      }),
  });

  const baseArray = useMemo(() => [], []);

  const filteredReservations = useMemo(
    () =>
      data?.reservations.filter(
        (reservation) => reservation.shuttleRouteId === routeId,
      ) ?? baseArray,
    [data?.reservations, routeId],
  );

  const reservationTable = useTable({
    columns: reservationColumns,
    data: filteredReservations,
  });

  const busTable = useTable({
    columns: busColumns,
    data: buses ?? baseArray,
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <main className="flex h-full w-full flex-col gap-16 bg-white">
        <h1 className="text-[32px] font-500">노선별 예약 관리</h1>
        <section>
          <h2 className="text-24 font-500 pb-8 bg-grey-50 py-4 px-12 my-4 flex items-center">
            버스 목록
            <button
              type="button"
              className="text-14 font-500 bg-primary rounded-md ml-40 border border-grey-300 px-12 py-[3px]"
              onClick={() => setIsOpen(true)}
            >
              배정하기
            </button>
          </h2>
          <BaseTable table={busTable} />
        </section>
        <section className="w-full">
          <h2 className="text-24 font-500 pb-8 bg-grey-50 py-4 px-12 my-4 flex items-center">
            예약 목록
          </h2>
          <BaseTable table={reservationTable} />
        </section>
      </main>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 bg-white p-24 rounded-xl">
          <DialogTitle className="font-700 text-26">버스 배정</DialogTitle>
          <Description>예약한 사용자들을 버스에 배정합니다.</Description>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default Page;
