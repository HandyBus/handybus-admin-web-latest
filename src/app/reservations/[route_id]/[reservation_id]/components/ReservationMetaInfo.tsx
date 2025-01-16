import { columns as reservationMetaColumns } from '../types/reservationMeta.type';
import VerticalTable from '@/components/table/VerticalTable';
import useTable from '@/hooks/useTable';
import { ReservationView } from '@/types/v2/reservation.type';

interface Props {
  response: ReservationView;
}

const ReservationMetaInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: reservationMetaColumns,
  });

  return (
    <>
      <h2 className="text-[18px] font-500">예약 정보</h2>
      <VerticalTable table={table} />
    </>
  );
};

export default ReservationMetaInfo;
