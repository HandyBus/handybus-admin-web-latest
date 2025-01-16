import { ReservationView } from '@/types/v2/reservation.type';
import VerticalTable from '@/components/table/VerticalTable';
import { columns as eventColumns } from '../types/event.table.type';
import useTable from '@/hooks/useTable';
import BlueLink from '@/components/link/BlueLink';

interface Props {
  response: ReservationView;
}

const EventInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: eventColumns,
  });

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-[18px] font-500">이벤트 정보</h2>
        <BlueLink href={`/events/${response.shuttleRoute.event?.eventId}`}>
          이벤트 바로가기
        </BlueLink>
      </div>
      <VerticalTable table={table} />
    </>
  );
};

export default EventInfo;
