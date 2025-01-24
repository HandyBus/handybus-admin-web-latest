'use client';

import { busColumns } from '../types/table.type';
import BlueLink from '@/components/link/BlueLink';
import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { useGetShuttleBuses } from '@/services/shuttleOperation.service';

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
  } = useGetShuttleBuses(
    Number(eventId),
    Number(dailyEventId),
    Number(shuttleRouteId),
  );

  const busTable = useTable({
    data: buses ?? [],
    columns: busColumns,
  });

  return (
    <>
      <Heading.h2 className="flex items-baseline gap-20">
        버스 목록 ({buses?.length ?? 0})
        <BlueLink href={`${shuttleRouteId}/buses/new`} className="text-14">
          추가하기
        </BlueLink>
      </Heading.h2>
      {isBusPending && <div>Loading...</div>}
      {isBusError && <div>Error: {busError.message}</div>}
      {buses && <BaseTable table={busTable} />}
    </>
  );
};

export default Buses;
