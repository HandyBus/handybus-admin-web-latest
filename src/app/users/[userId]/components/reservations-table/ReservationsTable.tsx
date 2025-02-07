'use client';

import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';

interface Props {
  reservations: ReservationViewEntity[];
}

const ReservationsTable = ({ reservations }: Props) => {
  const table = useTable({
    data: reservations,
    columns,
  });

  return (
    <section className="flex w-full flex-col">
      <Heading.h2>예약 정보</Heading.h2>
      <BaseTable table={table} />
    </section>
  );
};

export default ReservationsTable;
