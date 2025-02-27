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
import Loading from '@/components/loading/Loading';
import useUserFilter from './hooks/useUserFilter';
import UserFilter from './components/UserFilter';
import ToolTip from '@/components/tool-tip/ToolTip';
import dayjs from 'dayjs';

const Page = () => {
  // 유저 수를 가져오기 위한 쿼리
  const { data: totalUsers } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
  });
  const totalUserCount = totalUsers?.pages[0]?.totalCount;

  const { data: inactiveUsers } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'INACTIVE',
  });
  const inactiveUserCount = inactiveUsers?.pages[0]?.totalCount;

  const { data: onboardingUsers } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: false,
  });
  const onboardingUserCount = onboardingUsers?.pages[0]?.totalCount;

  const { data: marketingAgreedUsers } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    marketingConsent: true,
  });
  const marketingAgreedUserCount = marketingAgreedUsers?.pages[0]?.totalCount;

  const { data: todayLoggedInUsers } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    lastLoginFrom: dayjs().tz('Asia/Seoul').startOf('day').toISOString(),
  });
  const todayLoggedInUserCount = todayLoggedInUsers?.pages[0]?.totalCount;

  // 테이블에 보여지는 유저 데이터
  const [option, dispatch] = useUserFilter({
    additionalOrderOptions: 'ASC',
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
      <Callout>
        <section className="grid max-w-740 grid-cols-3 gap-8">
          <div className="flex items-center gap-8">
            총 유저 수: <b>{totalUserCount}</b>
            <ToolTip>
              <b>온보딩을 완료하지 않은 유저</b>들과 <b>탈퇴한 유저</b>들을
              제외한 수입니다.
            </ToolTip>
          </div>
          <div>
            오늘 접속한 유저 수: <b>{todayLoggedInUserCount}</b>
          </div>
          <div>
            탈퇴한 유저 수: <b>{inactiveUserCount}</b>
          </div>
          <div>
            온보딩을 완료하지 않은 유저 수: <b>{onboardingUserCount}</b>
          </div>
          <div>
            마케팅 동의 유저 수: <b>{marketingAgreedUserCount}</b>
          </div>
        </section>
        <br />
        <span className="text-14 text-grey-800">
          성별, 연령대, 지역이 없는 유저들은 온보딩을 완료하지 않은
          유저들입니다.
        </span>
      </Callout>
      <UserFilter option={option} dispatch={dispatch} />
      <p className="text-14 text-grey-800">
        {currentUserCount}건의 검색 결과가 있습니다.
      </p>
      <BaseTable table={table} />
      {isFetchingNextPage && <Loading />}
      <InfiniteScrollTrigger />
    </main>
  );
};

export default Page;
