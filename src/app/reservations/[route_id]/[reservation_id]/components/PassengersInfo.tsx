import { columns as passengerColumns } from '../types/passenger.table.type';
import { ReservationView } from '@/types/v2/reservation.type';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';

interface Props {
  response: ReservationView;
}

const PassengersInfo = ({ response }: Props) => {
  const table = useTable({
    data: response.passengers,
    columns: passengerColumns,
  });

  return (
    <>
      <h2 className="text-[18px] font-500">탑승객 정보</h2>
      <BaseTable table={table} />
    </>
  );
};

export default PassengersInfo;
