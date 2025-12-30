'use client';

import { columns } from './table.type';
import { Suspense, useMemo } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import JobPostingFilter from './components/JobPostingFilter';
import { PAGINATION_LIMIT } from '@/constants/config';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import useJobPostingFilter from './hooks/useJobPostingFilter';
import { useGetJobPostingsWithPagination } from '@/services/recruitment.service';
import ColumnFilter from '@/components/table/ColumnFilter';
import Heading from '@/components/text/Heading';
import BlueLink from '@/components/link/BlueLink';

const Page = () => {
  return (
    <Suspense>
      <main className="flex grow flex-col">
        <Heading className="flex items-baseline gap-20">
          채용 대시보드
          <BlueLink href="/recruitment/new" className="text-14">
            채용 공고 추가하기
          </BlueLink>
        </Heading>
        <AllJobPostings />
      </main>
    </Suspense>
  );
};

export default Page;

const AllJobPostings = () => {
  const [option, dispatch] = useJobPostingFilter();

  const { data, fetchNextPage, isFetching, hasNextPage, isError, error } =
    useGetJobPostingsWithPagination({
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
    () => data.pages.flatMap((page) => page.jobPostings),
    [data],
  );

  const table = useTable({
    columns,
    data: flatData,
    manualFiltering: true,
  });

  return (
    <section className="flex flex-col">
      <JobPostingFilter option={option} dispatch={dispatch} />
      <ColumnFilter table={table} />
      <BaseTable table={table} />
      {flatData.length === 0 && !isFetching && <p>데이터가 없습니다.</p>}
      {isError ? <p>에러 : {error.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      <InfiniteScrollTrigger />
    </section>
  );
};
