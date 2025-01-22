import { columns as routeHubColumns } from '../types/routeHub.table.type';
import useTable from '@/hooks/useTable';
import VerticalTable from '@/components/table/VerticalTable';
import { ReservationViewEntity } from '@/types/reservation.type';

interface Props {
  response: ReservationViewEntity;
}

const RouteHubInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: routeHubColumns,
  });

  return (
    <>
      <h2 className="text-[18px] font-500">탑승지 정보</h2>
      <VerticalTable table={table} />
    </>
  );
};

export default RouteHubInfo;
