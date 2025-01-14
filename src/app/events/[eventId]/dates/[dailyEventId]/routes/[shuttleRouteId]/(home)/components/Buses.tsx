'use client';

import { readBuses } from '@/services/v2/shuttleBus.services';
import { useQuery } from '@tanstack/react-query';
import { busColumns } from '../types/table.type';
import BlueLink from '@/components/link/BlueLink';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';

interface Props {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
}

const Buses = ({ eventId, dailyEventId, shuttleRouteId }: Props) => {
  const {
    data: buses,
    isPending: isBusPending,
    isError: isBusError,
    error: busError,
  } = useQuery({
    queryKey: ['buses', eventId, dailyEventId, shuttleRouteId],
    queryFn: () =>
      readBuses(Number(eventId), Number(dailyEventId), Number(shuttleRouteId)),
  });

  const busTable = useTable({
    data: buses ?? [],
    columns: busColumns,
  });

  return (
    <>
      <header className="flex flex-row justify-between">
        <h3 className="text-[24px] font-500">
          버스 목록 ({buses?.length ?? 0})
        </h3>
        <BlueLink href={`${shuttleRouteId}/buses/new`}>추가하기</BlueLink>
      </header>
      {isBusPending && <div>Loading...</div>}
      {isBusError && <div>Error: {busError.message}</div>}
      {buses && <BaseTable table={busTable} />}
    </>
  );
};

export default Buses;
