'use client';

import useTable from '@/hooks/useTable';
import { useGetUsersWithPagination } from '@/services/user.service';
import { columns } from './table.type';
import { useMemo } from 'react';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import { PAGINATION_LIMIT } from '@/constants/config';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Loading from '@/components/loading/Loading';
import useUserFilter from './hooks/useUserFilter';
import UserFilter from './components/UserFilter';

const Page = () => {
  const [option, dispatch] = useUserFilter({
    status: 'ACTIVE',
    onboardingComplete: true,
  });
  const {
    data: users,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useGetUsersWithPagination({
    ...option,
    page: undefined,
    limit: PAGINATION_LIMIT,
  });

  const { InfiniteScrollTrigger } = useInfiniteScroll({
    fetchNextPage,
    isLoading: isFetching,
    hasNextPage,
  });

  const flattenedUsers = useMemo(
    () => users?.pages.flatMap((page) => page.users) || [],
    [users],
  );
  const currentUserCount = useMemo(
    () => users?.pages?.[0]?.totalCount,
    [users],
  );

  const table = useTable({
    columns,
    data: flattenedUsers,
    manualFiltering: true,
  });

  return (
    <main className="flex grow flex-col">
      <Heading>유저 대시보드</Heading>
      <UserFilter option={option} dispatch={dispatch} />
      <p className="text-14 text-basic-grey-700">
        {currentUserCount}건의 검색 결과가 있습니다.
      </p>
      <BaseTable table={table} />
      {isFetchingNextPage && <Loading />}
      <InfiniteScrollTrigger />
    </main>
  );
};

export default Page;
