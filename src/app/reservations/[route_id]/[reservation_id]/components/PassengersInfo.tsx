import { columns as passengerColumns } from '../types/passenger.table.type';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';
import { ReservationViewEntity } from '@/types/reservation.type';

interface Props {
  response: ReservationViewEntity;
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
