'use client';

import { columns } from './types/table.type';
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

const Page = () => {
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <h1 className="text-[32px] font-500">예약 관리</h1>
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
    selectedEvent?.eventId ?? 0,
    selectedDailyEvent?.dailyEventId ?? 0,
  );

  return (
    <section className="pb-40">
      <h2 className="text-24 font-500 pb-8 bg-grey-50 py-4 px-12 my-4 flex items-center">
        노선별 예약 조회
      </h2>
      <div className="flex w-full justify-between h-500">
        <article className="h-full w-400 flex flex-col">
          <p className="font-500 text-20 pb-4 text-grey-900">행사 선택</p>
          <ul className="grow overflow-scroll border border-grey-200 rounded-[4px]">
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
                <span className="text-14 text-grey-500 ml-auto block">
                  {Stringifier.eventStatus(event.eventStatus)}
                </span>
              </button>
            ))}
          </ul>
        </article>
        <article className="h-full w-400 flex flex-col">
          <p className="font-500 text-20 pb-4 text-grey-900">
            일자별 행사 선택
          </p>
          <ul className="grow overflow-scroll border border-grey-200 rounded-[4px]">
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
              <div className="h-full flex items-center justify-center text-grey-500">
                행사를 선택해주세요.
              </div>
            )}
          </ul>
        </article>
        <article className="h-full w-400 flex flex-col">
          <p className="font-500 text-20 pb-4 text-grey-900">
            일자별 노선 선택
          </p>
          <ul className="grow overflow-scroll border border-grey-200 rounded-[4px]">
            {selectedDailyEvent ? (
              shuttleRoutes?.length !== 0 ? (
                shuttleRoutes?.map((shuttleRoute) => (
                  <Link
                    key={shuttleRoute.shuttleRouteId}
                    href={`/reservations/${shuttleRoute.shuttleRouteId}?eventId=${selectedEvent?.eventId}&dailyEventId=${selectedDailyEvent?.dailyEventId}`}
                    className="block w-full border-b border-grey-100 px-12 py-12 text-left hover:bg-grey-50"
                  >
                    {shuttleRoute.name}
                    <p className="text-14 text-grey-500 ml-auto flex gap-12">
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
                <div className="h-full flex items-center justify-center text-grey-500">
                  노선이 존재하지 않습니다.
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-grey-500">
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
      page: 0,
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
      <h2 className="text-24 font-500 pb-8 bg-grey-50 py-4 px-12 my-4 flex items-center">
        모든 예약 조회
      </h2>
      <RowFilter option={option} dispatch={dispatch} />
      <ColumnFilter table={table} />
      {/* TODO virtualization */}
      <BaseTable table={table} />
      {flatData.length === 0 && !isFetching && <p>데이터가 없습니다.</p>}
      {isError ? <p>에러 : {error.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      {hasNextPage && <div ref={ref} />}
    </section>
  );
};
