'use client';

import BlueLink from '@/components/link/BlueLink';
import Shuttle from '@/app/shuttles/[shuttle_id]/(home)/components/Shuttle';
import { getRoutes } from '@/services/v2/shuttleRoute.services';
import { getShuttle } from '@/services/v1/shuttle.services';
import { notFound } from 'next/navigation';
import { columns } from './types/table.type';
import DataTable from '@/components/table/DataTable';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface Props {
  params: { shuttle_id: string; daily_id: string };
}

const Page = ({ params: { shuttle_id, daily_id } }: Props) => {
  const {
    data: shuttle,
    isPending: isShuttlePending,
    isError: isShuttleError,
    error: shuttleError,
  } = useQuery({
    queryKey: ['shuttle', shuttle_id],
    queryFn: () => getShuttle(Number(shuttle_id)),
  });

  const {
    data: routes,
    isPending: isRoutesPending,
    isError: isRoutesError,
    error: routesError,
  } = useQuery({
    queryKey: ['routes', shuttle_id, daily_id],
    queryFn: () => getRoutes(Number(shuttle_id), Number(daily_id)),
  });

  const thisDailyShuttle = shuttle
    ? shuttle.dailyShuttles.find((d) => d.dailyShuttleId === Number(daily_id))
    : null;

  useEffect(() => {
    if (shuttle && !thisDailyShuttle) {
      notFound();
    }
  }, [shuttle, thisDailyShuttle]);

  if (isShuttleError || isRoutesError) {
    return (
      <div>
        Error! shuttle error : {shuttleError?.message}, or routes error :{' '}
        {routesError?.message}
      </div>
    );
  }

  if (isShuttlePending || isRoutesPending) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">일자별 셔틀 상세</h1>
      </header>
      <div className="flex flex-col gap-16">
        일자별 셔틀 정보
        <pre className="p-8 bg-grey-50 rounded-lg">
          {JSON.stringify(thisDailyShuttle, null, 2)}
        </pre>
        이 일자별 셔틀과 연결된 셔틀 정보
        <Shuttle shuttle={shuttle} />
        <header className="flex flex-row justify-between">
          <h1 className="text-[24px] font-500">노선 목록</h1>
          <BlueLink href={`${daily_id}/routes/new`}>추가하기</BlueLink>
        </header>
        <DataTable data={routes} columns={columns} />
      </div>
    </main>
  );
};

export default Page;
