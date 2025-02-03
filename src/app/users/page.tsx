'use client';

import useTable from '@/hooks/useTable';
import { useGetUsersWithPagination } from '@/services/userManagement.service';
import { columns } from './table.type';
import { useMemo } from 'react';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import Callout from '@/components/text/Callout';

const Page = () => {
  const { data: users } = useGetUsersWithPagination();
  const flattenedUsers = useMemo(
    () => users?.pages.flatMap((page) => page.users) || [],
    [users],
  );

  const table = useTable({
    columns,
    data: flattenedUsers,
    manualFiltering: true,
  });

  return (
    <main className="flex flex-col">
      <Heading>유저 대시보드</Heading>
      <Callout>
        성별, 연령대, 지역이 없는 유저들은 온보딩을 완료하지 않은 유저들입니다.
      </Callout>
      <BaseTable table={table} />
    </main>
  );
};

export default Page;
