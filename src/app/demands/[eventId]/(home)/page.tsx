'use client';

import useTable from '@/hooks/useTable';
import { columnGroupByCity } from './types/table.type';
import BaseTable from '@/components/table/BaseTable';
import { formatDateString } from '@/utils/date.util';
import BlueLink from '@/components/link/BlueLink';
import {
  GetDemandOptions,
  useGetDemandsStats,
  useGetEvent,
} from '@/services/shuttleOperation.service';
import { EventDailyShuttlesInEventsViewEntity } from '@/types/event.type';

interface Props {
  params: { eventId: number };
}

/**
 *
 * @param param0
 * @returns
 */
const Page = ({ params: { eventId } }: Props) => {
  const { data: event, isPending, isError } = useGetEvent(eventId);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Failed to load event</div>;

  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-[32px] font-500">
        <BlueLink href={`/events/${event.eventId}`}>{event.eventName}</BlueLink>
        의 셔틀 수요
      </h1>
      {event.dailyEvents.length === 0 ? (
        <div>
          이 행사에 등록된 일정이 없습니다. 이 상황은 일반적이지 않습니다.
          어드민 개발팀에 문의해주세요.
        </div>
      ) : (
        event.dailyEvents.map((dailyEvent) => (
          <TablePerDailyEvent
            key={dailyEvent.dailyEventId}
            eventId={eventId}
            dailyEvent={dailyEvent}
          />
        ))
      )}
    </div>
  );
};

export default Page;

interface SubProps {
  eventId: number;
  dailyEvent: EventDailyShuttlesInEventsViewEntity;
}

const TablePerDailyEvent = ({ eventId, dailyEvent }: SubProps) => {
  const options: GetDemandOptions = {
    groupBy: 'CITY',
    eventId,
    dailyEventId: dailyEvent.dailyEventId,
  };

  const { data, isPending, isError } = useGetDemandsStats(options);

  const table = useTable({
    data: data,
    columns: columnGroupByCity,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Failed to load demand</div>;

  return (
    <article>
      <header className="flex flex-row items-center gap-4">
        <h1 className="text-[24px] font-500">
          {formatDateString(dailyEvent.date, 'date')} 일자 수요
        </h1>
        <BlueLink href={`./${eventId}/dates/${dailyEvent.dailyEventId}`}>
          자세히
        </BlueLink>
      </header>
      {data.length === 0 ? (
        '이 날짜에 해당하는 수요가 현재 없습니다.'
      ) : (
        <BaseTable table={table} />
      )}
    </article>
  );
};
