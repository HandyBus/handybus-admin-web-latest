import VerticalTable from '@/components/table/VerticalTable';
import { columns as eventColumns } from '../types/event.table.type';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';
import { ReservationViewEntity } from '@/types/reservation.type';
import Heading from '@/components/text/Heading';

interface Props {
  response: ReservationViewEntity;
}

const EventInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: eventColumns,
  });

  return (
    <article className="flex flex-col">
      <Heading.h2>
        행사 정보{' '}
        <BlueLink
          href={`/events/${response.shuttleRoute.event?.eventId}`}
          className="ml-auto text-14"
        >
          행사 바로가기
        </BlueLink>
      </Heading.h2>
      <VerticalTable table={table} />
    </article>
  );
};

export default EventInfo;
