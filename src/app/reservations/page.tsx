'use client';

import { getReservations } from '@/services/v2/reservations.services';
import { columns } from './types/table.type';
import { useCallback, useMemo, useState } from 'react';
import ManuallyFilteredInfiniteTable from '@/components/table/ManuallyFilteredInfiniteTable';
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import useParamState, {
  optionalNumberOpt as nOpt,
  optionalStringOpt as sOpt,
} from '@/hooks/useParamState';
import RowFilter from './components/ReservationFilter';
import { ReservationView } from '@/types/v2/reservation.type';
import useColumnVisibility from '@/hooks/useColumnVisibility';
import { getAllEvents } from '@/services/v2/event.services';
import { EventsView } from '@/types/v2/event.type';
import { getRoutes } from '@/services/v2/shuttleRoute.services';
import Link from 'next/link';

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
  const [selectedEvent, setSelectedEvent] = useState<EventsView | null>(null);
  const [selectedDailyEvent, setSelectedDailyEvent] = useState<
    EventsView['dailyEvents'][number] | null
  >(null);

  const queryClient = useQueryClient();
  const { data: events } = useQuery({
    queryKey: ['event'],
    queryFn: () => getAllEvents(),
  });

  const { data: shuttleRoutes } = useQuery({
    queryKey: [
      'shuttleRoute',
      selectedEvent?.eventId,
      selectedDailyEvent?.dailyEventId,
    ],
    queryFn: () => {
      if (!selectedEvent || !selectedDailyEvent) {
        return [];
      }
      return getRoutes(selectedEvent.eventId, selectedDailyEvent.dailyEventId);
    },
    enabled: !!selectedEvent && !!selectedDailyEvent,
  });

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
                className={`w-full border-b border-grey-100 px-12 py-12  text-left ${
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
            일자별 행사 선택
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
  // TODO add more filters (v2)
  const [eventId] = useParamState(undefined, 'eventId', nOpt);
  const [dailyEventId] = useParamState(undefined, 'dailyEventId', nOpt);
  const [shuttleRouteId] = useParamState(undefined, 'shuttleRouteId', nOpt);
  const [userNickname] = useParamState(undefined, 'userNickname', sOpt);
  const [passengerName] = useParamState(undefined, 'passengerName', sOpt);

  const queryFn = useCallback(
    ({ pageParam }: { pageParam: number }) => {
      return getReservations({
        page: pageParam,
        eventId,
        dailyEventId,
        shuttleRouteId,
        userNickname,
        passengerName,
      });
    },
    [eventId, dailyEventId, shuttleRouteId, userNickname, passengerName],
  );

  const infiniteDataQuery = useInfiniteQuery({
    queryKey: [
      'reservations',
      eventId,
      dailyEventId,
      shuttleRouteId,
      userNickname,
      passengerName,
    ],
    queryFn: queryFn,
    initialPageParam: 0,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      console.log('lastPage' + lastPage.nextPage);
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });
  const { data, fetchNextPage, isFetching, hasNextPage } = infiniteDataQuery;
  const ref = useInfiniteScroll(fetchNextPage);

  const defaultData: ReservationView[] = useMemo(() => [], []);

  const flatData = useMemo(
    () => data.pages.flatMap((page) => page.reservations),
    [data],
  );

  const [columnVisibility, ColumnFilter] = useColumnVisibility(columns);

  return (
    <section>
      <h2 className="text-24 font-500 pb-8 bg-grey-50 py-4 px-12 my-4 flex items-center">
        모든 예약 조회
      </h2>
      <RowFilter />
      <ColumnFilter columnVisibility={columnVisibility} />
      {/* TODO virtualization */}
      <ManuallyFilteredInfiniteTable
        data={flatData ?? defaultData}
        columns={columns}
        columnVisibility={columnVisibility}
      />
      {infiniteDataQuery.isError ? (
        <p>에러 : {infiniteDataQuery.error.message}</p>
      ) : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      {hasNextPage && <div ref={ref} />}
    </section>
  );
};
