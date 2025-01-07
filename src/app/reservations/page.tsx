'use client';

import { getReservations } from '@/services/v2/reservations.services';
import { columns } from './types/table.type';
import { useCallback, useMemo } from 'react';
import ManuallyFilteredInfiniteTable from '@/components/table/ManuallyFilteredInfiniteTable';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import useParamState, {
  optionalNumberOpt as nOpt,
  optionalStringOpt as sOpt,
} from '@/hooks/useParamState';
import RowFilter from './components/ReservationFilter';
import { ReservationViewType } from '@/types/v2/reservation.type';
import useColumnVisibility from '@/hooks/useColumnVisibility';

const Page = () => {
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

  const defaultData: ReservationViewType[] = useMemo(() => [], []);

  const flatData = useMemo(
    () => data.pages.flatMap((page) => page.reservations),
    [data],
  );

  const [columnVisibility, ColumnFilter] = useColumnVisibility(columns);

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <h1 className="text-[32px] font-500">예약 관리</h1>
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
    </main>
  );
};

export default Page;
