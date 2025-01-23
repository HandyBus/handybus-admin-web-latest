import { columns as passengerColumns } from '../types/passenger.table.type';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';
import { ReservationViewEntity } from '@/types/reservation.type';
import Heading from '@/components/text/Heading';

interface Props {
  response: ReservationViewEntity;
}

const PassengersInfo = ({ response }: Props) => {
  const table = useTable({
    data: response.passengers,
    columns: passengerColumns,
  });

  return (
    <article className="flex flex-col">
      <Heading.h2>탑승객 정보</Heading.h2>
      <BaseTable table={table} />
    </article>
  );
};

export default PassengersInfo;
