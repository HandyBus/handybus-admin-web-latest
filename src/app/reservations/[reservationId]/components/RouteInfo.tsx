import VerticalTable from '@/components/table/VerticalTable';
import { columns as routeColumns } from '../types/route.table.type';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';
import { ReservationViewEntity } from '@/types/reservation.type';
import Heading from '@/components/text/Heading';

interface Props {
  response: ReservationViewEntity;
}

const RouteInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response.shuttleRoute],
    columns: routeColumns,
  });

  return (
    <article className="flex flex-col">
      <Heading.h2>
        노선 정보{' '}
        <BlueLink
          href={`/events/${response.shuttleRoute.event?.eventId}/dates/${response.shuttleRoute.dailyEventId}/routes/${response.shuttleRoute.shuttleRouteId}`}
          className="ml-auto text-14"
        >
          해당 노선 바로가기
        </BlueLink>
      </Heading.h2>
      <VerticalTable table={table} />
    </article>
  );
};

export default RouteInfo;
