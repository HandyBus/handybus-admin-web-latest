'use client';

import useTable from '@/hooks/useTable';
import { useGetUsersWithPagination } from '@/services/userManagement.service';
import { columns } from './table.type';
import { useMemo } from 'react';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import Callout from '@/components/text/Callout';
import { PAGINATION_LIMIT } from '@/constants/config';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const Page = () => {
  const {
    data: users,
    hasNextPage,
    fetchNextPage,
  } = useGetUsersWithPagination({
    page: undefined,
    limit: PAGINATION_LIMIT,
  });

  const ref = useInfiniteScroll(fetchNextPage);

  const flattenedUsers = useMemo(
    () => users?.pages.flatMap((page) => page.users) || [],
    [users],
  );
  const totalUserCount = users?.pages?.[0]?.totalCount;

  const table = useTable({
    columns,
    data: flattenedUsers,
    manualFiltering: true,
  });

  return (
    <main className="flex flex-col">
      <Heading>유저 대시보드</Heading>
      <Callout>
        총 유저 수: <b>{totalUserCount}</b>
        <br />
        <span className="text-14">
          성별, 연령대, 지역이 없는 유저들은 온보딩을 완료하지 않은
          유저들입니다.
        </span>
      </Callout>
      <BaseTable table={table} />
      {hasNextPage && <div ref={ref} />}
    </main>
  );
};

export default Page;
