'use client';

import { columns } from './table.type';
import { useMemo } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import JobApplicationFilter from './components/JobApplicationFilter';
import { PAGINATION_LIMIT } from '@/constants/config';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import useJobApplicationFilter from './hooks/useJobApplicationFilter';
import { useGetJobApplicationsWithPagination } from '@/services/recruitment.service';
import ColumnFilter from '@/components/table/ColumnFilter';
import Heading from '@/components/text/Heading';

interface Props {
  params: {
    id: string;
  };
}

const Page = ({ params: { id } }: Props) => {
  return (
    <main className="flex grow flex-col">
      <Heading>채용 공고 상세</Heading>
      <AllJobApplications jobPostingId={id} />
    </main>
  );
};

export default Page;

const AllJobApplications = ({ jobPostingId }: { jobPostingId: string }) => {
  const [option, dispatch] = useJobApplicationFilter();

  const { data, fetchNextPage, isFetching, hasNextPage, isError, error } =
    useGetJobApplicationsWithPagination({
      ...option,
      jobPostingId,
      page: undefined,
      limit: PAGINATION_LIMIT,
    });

  const { InfiniteScrollTrigger } = useInfiniteScroll({
    fetchNextPage,
    isLoading: isFetching,
    hasNextPage,
  });

  const flatData = useMemo(
    () => data.pages.flatMap((page) => page.jobApplications),
    [data],
  );

  const table = useTable({
    columns,
    data: flatData,
    manualFiltering: true,
  });

  return (
    <section className="flex flex-col">
      <Heading.h2>지원자 목록</Heading.h2>
      <JobApplicationFilter option={option} dispatch={dispatch} />
      <ColumnFilter table={table} />
      <BaseTable table={table} />
      {flatData.length === 0 && !isFetching && <p>데이터가 없습니다.</p>}
      {isError ? <p>에러 : {error.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      <InfiniteScrollTrigger />
    </section>
  );
};
