import { columns as routeHubColumns } from '../types/routeHub.table.type';
import useTable from '@/hooks/useTable';
import VerticalTable from '@/components/table/VerticalTable';
import { ReservationViewEntity } from '@/types/reservation.type';
import Heading from '@/components/text/Heading';

interface Props {
  response: ReservationViewEntity;
}

const RouteHubInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: routeHubColumns,
  });

  return (
    <article className="flex flex-col">
      <Heading.h2>탑승지 정보</Heading.h2>
      <VerticalTable table={table} />
    </article>
  );
};

export default RouteHubInfo;
