'use client';

import { columns } from './table.type';
import { useMemo } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import RowFilter from './components/ReservationFilter';
import { PAGINATION_LIMIT } from '@/constants/config';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import useReservationFilter from './hooks/userReservationFilter';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import ColumnFilter from '@/components/table/ColumnFilter';
import Heading from '@/components/text/Heading';

const Page = () => {
  return (
    <main>
      <Heading>예약 대시보드</Heading>
      <AllReservations />
    </main>
  );
};

export default Page;

const AllReservations = () => {
  const [option, dispatch] = useReservationFilter();

  const { data, fetchNextPage, isFetching, hasNextPage, isError, error } =
    useGetReservationsWithPagination({
      ...option,
      page: undefined,
      limit: PAGINATION_LIMIT,
    });

  const { InfiniteScrollTrigger } = useInfiniteScroll({
    fetchNextPage,
    isLoading: isFetching,
    hasNextPage,
  });

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
    <section className="flex flex-col">
      <Heading.h2>모든 예약 조회</Heading.h2>
      <RowFilter option={option} dispatch={dispatch} />
      <ColumnFilter table={table} />
      <BaseTable table={table} />
      {flatData.length === 0 && !isFetching && <p>데이터가 없습니다.</p>}
      {isError ? <p>에러 : {error.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      <InfiniteScrollTrigger />
    </section>
  );
};
