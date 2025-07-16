'use client';

import Heading from '@/components/text/Heading';
import { useGetEvent } from '@/services/event.service';
import { columns } from './table.type';
import VerticalTable from '@/components/table/VerticalTable';
import useTable from '@/hooks/useTable';
import { EventsViewEntity } from '@/types/event.type';

interface Props {
  params: {
    eventId: string;
  };
}

const Page = ({ params }: Props) => {
  const { eventId } = params;

  const { data: event } = useGetEvent(eventId);

  return (
    <main className="flex flex-col">
      <Heading>행사 상세 페이지</Heading>
      {event && <EventTable event={event} />}
    </main>
  );
};

export default Page;

interface EventTableProps {
  event: EventsViewEntity;
}

const EventTable = ({ event }: EventTableProps) => {
  const table = useTable({
    columns,
    data: [event],
  });
  return <VerticalTable table={table} />;
};
