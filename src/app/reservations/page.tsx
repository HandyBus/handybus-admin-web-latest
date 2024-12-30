'use client';

import { getReservations } from '../actions/reservations.action';
import { columns } from './types/table.type';
import { useCallback, useMemo } from 'react';
import ManuallyFilteredInfiniteTable from '@/components/table/PaginatedTable';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import useParamState, {
  optionalNumberOpt as nOpt,
  optionalStringOpt as sOpt,
} from '@/hooks/useParamState';
import Filter from './components/ReservationFilter';
import { ReservationType } from '@/types/reservation.type';

const Page = () => {
  const [shuttleId] = useParamState(undefined, 'shuttleId', nOpt);
  const [dailyShuttleId] = useParamState(undefined, 'dailyShuttleId', nOpt);
  const [shuttleRouteId] = useParamState(undefined, 'shuttleRouteId', nOpt);
  const [userNickname] = useParamState(undefined, 'userNickname', sOpt);
  const [passengerName] = useParamState(undefined, 'passengerName', sOpt);

  const queryFn = useCallback(
    ({ pageParam }: { pageParam: number }) => {
      return getReservations(
        { pageIndex: pageParam, pageSize: 4 },
        shuttleId,
        dailyShuttleId,
        shuttleRouteId,
        userNickname,
        passengerName,
      );
    },
    [shuttleId, dailyShuttleId, shuttleRouteId, userNickname, passengerName],
  );

  const infiniteDataQuery = useInfiniteQuery({
    queryKey: [
      'reservations',
      shuttleId,
      dailyShuttleId,
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

  const defaultData: ReservationType[] = useMemo(() => [], []);

  const flatData = useMemo(
    () => data.pages.flatMap((page) => page.reservations),
    [data],
  );

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <h1 className="text-[32px] font-500">예약 관리</h1>
      <Filter />
      {/* TODO virtualization */}
      <ManuallyFilteredInfiniteTable
        data={flatData ?? defaultData}
        columns={columns}
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
