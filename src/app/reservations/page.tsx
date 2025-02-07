'use client';

import { columns } from './table.type';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import RowFilter from './components/ReservationFilter';
import {
  EventDailyShuttlesInEventsViewEntity,
  EventsViewEntity,
} from '@/types/event.type';
import Link from 'next/link';
import Stringifier from '@/utils/stringifier.util';
import { PAGINATION_LIMIT } from '@/constants/config';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import useReservationFilter from './hooks/userReservationFilter';
import {
  useGetEvents,
  useGetReservationsWithPagination,
  useGetShuttleRoutesOfDailyEvent,
} from '@/services/shuttleOperation.service';
import ColumnFilter from '@/components/table/ColumnFilter';
import Heading from '@/components/text/Heading';

const Page = () => {
  return (
    <main>
      <Heading>예약 대시보드</Heading>
      <RouteReservations />
      <AllReservations />
    </main>
  );
};

export default Page;

const RouteReservations = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventsViewEntity | null>(
    null,
  );
  const [selectedDailyEvent, setSelectedDailyEvent] =
    useState<EventDailyShuttlesInEventsViewEntity | null>(null);

  const queryClient = useQueryClient();

  const { data: events } = useGetEvents();
  const { data: shuttleRoutes } = useGetShuttleRoutesOfDailyEvent(
    selectedEvent?.eventId ?? '',
    selectedDailyEvent?.dailyEventId ?? '',
  );

  return (
    <section className="pb-20">
      <Heading.h2>노선별 예약 조회</Heading.h2>
      <div className="flex h-500 w-full justify-between">
        <article className="flex h-full w-400 flex-col">
          <Heading.h4>행사 선택</Heading.h4>
          <ul className="grow overflow-scroll rounded-[4px] border border-grey-200">
            {events?.map((event) => (
              <button
                key={event.eventId}
                type="button"
                className={`w-full border-b border-grey-100 px-12 py-12 text-left ${
                  selectedEvent?.eventId === event.eventId
                    ? 'bg-grey-100'
                    : 'hover:bg-grey-50'
                }`}
                onClick={async () => {
                  setSelectedEvent(event);
                  setSelectedDailyEvent(null);
                  await queryClient.invalidateQueries({
                    queryKey: ['shuttleRoute'],
                  });
                }}
              >
                {event.eventName}
                <span className="ml-auto block text-14 text-grey-500">
                  {Stringifier.eventStatus(event.eventStatus)}
                </span>
              </button>
            ))}
          </ul>
        </article>
        <article className="flex h-full w-400 flex-col">
          <Heading.h4>일자별 행사 선택</Heading.h4>
          <ul className="grow overflow-scroll rounded-[4px] border border-grey-200">
            {selectedEvent ? (
              selectedEvent.dailyEvents.map((dailyEvent) => (
                <button
                  key={dailyEvent.dailyEventId}
                  type="button"
                  className={`w-full border-b border-grey-100 px-12 py-12  text-left ${
                    selectedDailyEvent?.dailyEventId === dailyEvent.dailyEventId
                      ? 'bg-grey-100'
                      : 'hover:bg-grey-50'
                  }`}
                  onClick={() => {
                    setSelectedDailyEvent(dailyEvent);
                  }}
                >
                  {new Date(dailyEvent.date).toLocaleDateString()}
                </button>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-grey-500">
                행사를 선택해주세요.
              </div>
            )}
          </ul>
        </article>
        <article className="flex h-full w-400 flex-col">
          <Heading.h4>일자별 노선 선택</Heading.h4>
          <ul className="grow overflow-scroll rounded-[4px] border border-grey-200">
            {selectedDailyEvent ? (
              shuttleRoutes?.length !== 0 ? (
                shuttleRoutes?.map((shuttleRoute) => (
                  <Link
                    key={shuttleRoute.shuttleRouteId}
                    href={`/reservations/${shuttleRoute.shuttleRouteId}?eventId=${selectedEvent?.eventId}&dailyEventId=${selectedDailyEvent?.dailyEventId}`}
                    className="block w-full border-b border-grey-100 px-12 py-12 text-left hover:bg-grey-50"
                  >
                    {shuttleRoute.name}
                    <p className="ml-auto flex gap-12 text-14 text-grey-500">
                      <span>
                        {Stringifier.shuttleRouteStatus(shuttleRoute.status)}
                      </span>
                      <span>
                        {shuttleRoute.fromDestinationCount +
                          shuttleRoute.toDestinationCount}
                        석 예약
                      </span>
                    </p>
                  </Link>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-grey-500">
                  노선이 존재하지 않습니다.
                </div>
              )
            ) : (
              <div className="flex h-full items-center justify-center text-grey-500">
                일자별 행사를 선택해주세요.
              </div>
            )}
          </ul>
        </article>
      </div>
    </section>
  );
};

const AllReservations = () => {
  const [option, dispatch] = useReservationFilter();

  const { data, fetchNextPage, isFetching, hasNextPage, isError, error } =
    useGetReservationsWithPagination({
      ...option,
      page: undefined,
      limit: PAGINATION_LIMIT,
    });

  const ref = useInfiniteScroll(fetchNextPage);

  const flatData = useMemo(
    () => data.pages.flatMap((page) => page.reservations),
    [data],
  );

  const table = useTable({
    columns,
    data: flatData,
    manualFiltering: true,
  });

  return (
    <section>
      <Heading.h2>모든 예약 조회</Heading.h2>
      <RowFilter option={option} dispatch={dispatch} />
      <ColumnFilter table={table} />
      <BaseTable table={table} />
      {flatData.length === 0 && !isFetching && <p>데이터가 없습니다.</p>}
      {isError ? <p>에러 : {error.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      {hasNextPage && <div ref={ref} />}
    </section>
  );
};
