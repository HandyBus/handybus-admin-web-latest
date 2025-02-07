import { columns as reservationMetaColumns } from '../types/reservationMeta.type';
import VerticalTable from '@/components/table/VerticalTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { ReservationViewEntity } from '@/types/reservation.type';

interface Props {
  response: ReservationViewEntity;
}

const ReservationMetaInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: reservationMetaColumns,
  });

  return (
    <article className="flex flex-col">
      <Heading.h2>예약 정보</Heading.h2>
      <VerticalTable table={table} />
    </article>
  );
};

export default ReservationMetaInfo;
