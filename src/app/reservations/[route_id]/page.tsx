'use client';

import useTable from '@/hooks/useTable';
import { getReservations } from '@/services/v2/reservations.services';
import { useQuery } from '@tanstack/react-query';
import { columns } from '../types/table.type';
import BaseTable from '@/components/table/BaseTable';

interface Props {
  params: {
    route_id: string;
  };
}

const Page = ({ params }: Props) => {
  const routeId = Number(params.route_id);
  const { data } = useQuery({
    queryKey: ['reservation', routeId],
    queryFn: async () => await getReservations({ shuttleRouteId: routeId }),
  });

  const filteredReservations =
    data?.reservations.filter(
      (reservation) => reservation.shuttleRouteId === routeId,
    ) ?? [];

  const table = useTable({
    columns,
    data: filteredReservations,
  });

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <h1 className="text-[32px] font-500">노선별 예약 관리</h1>
      <BaseTable table={table} />
    </main>
  );
};

export default Page;
