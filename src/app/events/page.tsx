'use client';

import BlueLink from '@/components/link/BlueLink';
import { columns } from './table.type';
import { useGetEventsStatsWithPagination } from '@/services/event.service';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import { useMemo } from 'react';
import EventFilter from './components/EventFilter';
import useEventFilter from './hooks/useEventFilter';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import dayjs from 'dayjs';

const EVENT_PAGINATION_LIMIT = 7;

const Page = () => {
  const [option, dispatch] = useEventFilter();
  const {
    data: eventsStats,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useGetEventsStatsWithPagination({
    ...option,
    limit: EVENT_PAGINATION_LIMIT,
  });

  const flattenedEventsStats = useMemo(
    () =>
      eventsStats?.pages
        .flatMap((page) => page.events)
        .map((event) => ({
          ...event,
          dailyEvents: event.dailyEvents
            ? [...event.dailyEvents].sort((a, b) =>
                dayjs(a.date).diff(dayjs(b.date)),
              )
            : [],
        })),
    [eventsStats],
  );

  const table = useTable({
    data: flattenedEventsStats,
    columns,
  });

  const { InfiniteScrollTrigger } = useInfiniteScroll({
    fetchNextPage,
    isLoading: isFetching,
    hasNextPage,
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        행사 대시보드
        <BlueLink href="events/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <EventFilter option={option} dispatch={dispatch} />
      <section className="flex flex-col">
        <BaseTable table={table} cellClassName="min-h-120 p-0" />
        <InfiniteScrollTrigger />
      </section>
    </main>
  );
};

export default Page;
