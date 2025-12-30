'use client';

import { columns } from './table.type';
import { Suspense, useMemo } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { LoaderCircleIcon } from 'lucide-react';
import { PAGINATION_LIMIT } from '@/constants/config';
import BaseTable from '@/components/table/BaseTable';
import useTable from '@/hooks/useTable';
import { useGetJobApplicationsWithPagination } from '@/services/recruitment.service';
import ColumnFilter from '@/components/table/ColumnFilter';
import Heading from '@/components/text/Heading';

const Page = () => {
  return (
    <Suspense>
      <main className="flex grow flex-col">
        <Heading>인재풀</Heading>
        <AllTalentPoolApplications />
      </main>
    </Suspense>
  );
};

export default Page;

const AllTalentPoolApplications = () => {
  const { data, fetchNextPage, isFetching, hasNextPage, isError, error } =
    useGetJobApplicationsWithPagination({
      applicationType: 'TALENT_POOL',
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
      <ColumnFilter table={table} />
      <BaseTable table={table} />
      {flatData.length === 0 && !isFetching && <p>데이터가 없습니다.</p>}
      {isError ? <p>에러 : {error.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      <InfiniteScrollTrigger />
    </section>
  );
};
