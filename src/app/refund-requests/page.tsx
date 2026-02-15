'use client';

import { columns } from './table.type';
import { useMemo } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import { PAGINATION_LIMIT } from '@/constants/config';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import useRefundRequestFilter from './hooks/useRefundRequestFilter';
import { useGetRefundRequestsWithPagination } from '@/services/refund-request.service';
import ColumnFilter from '@/components/table/ColumnFilter';
import Heading from '@/components/text/Heading';
import RefundRequestFilter from './components/RefundRequestFilter';

const Page = () => {
  return (
    <main>
      <Heading>환불 요청 대시보드</Heading>
      <AllRefundRequests />
    </main>
  );
};

export default Page;

const AllRefundRequests = () => {
  const [option, dispatch] = useRefundRequestFilter();

  const { data, fetchNextPage, isFetching, hasNextPage, isError, error } =
    useGetRefundRequestsWithPagination({
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
    () => data.pages.flatMap((page) => page.refundRequests),
    [data],
  );

  const table = useTable({
    columns,
    data: flatData,
    manualFiltering: true,
  });

  return (
    <section className="flex flex-col">
      <Heading.h2>모든 환불 요청 조회</Heading.h2>
      <RefundRequestFilter option={option} dispatch={dispatch} />
      <ColumnFilter table={table} />
      <BaseTable table={table} />
      {flatData.length === 0 && !isFetching && <p>데이터가 없습니다.</p>}
      {isError ? <p>에러 : {error?.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      <InfiniteScrollTrigger />
    </section>
  );
};
