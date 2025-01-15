import { ReservationView } from '@/types/v2/reservation.type';
import VerticalTable from '@/components/table/VerticalTable';
import { columns as routeColumns } from '../types/route.table.type';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';

interface Props {
  response: ReservationView;
}

const RouteInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response.shuttleRoute],
    columns: routeColumns,
  });

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-[18px] font-500">노선 정보</h2>
        <BlueLink
          href={`/events/${response.shuttleRoute.event?.eventId}/dates/${response.shuttleRoute.dailyEventId}/routes/${response.shuttleRoute.shuttleRouteId}`}
        >
          해당 노선 바로가기
        </BlueLink>
      </div>
      <VerticalTable table={table} />
    </>
  );
};

export default RouteInfo;
