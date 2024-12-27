import BlueLink from '@/components/link/BlueLink';
import { getShuttle } from '@/app/actions/shuttle.action';
import Shuttle from '@/app/shuttles/[shuttle_id]/(home)/components/Shuttle';
import { getAllRoutes } from '@/app/actions/route.action';
import { notFound } from 'next/navigation';
import { columns } from './types/table.type';
import DataTable from '@/components/table/DataTable';

interface Props {
  params: { shuttle_id: string; daily_id: string };
}

const Page = async ({ params: { shuttle_id, daily_id } }: Props) => {
  const [shuttle, routes] = await Promise.all([
    getShuttle(Number(shuttle_id)),
    getAllRoutes(shuttle_id, daily_id),
  ]);

  const thisDailyShuttle = shuttle.dailyShuttles.find(
    (d) => d.dailyShuttleId === Number(daily_id),
  );

  if (!thisDailyShuttle) {
    notFound();
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
        <DataTable data={routes.shuttleRouteDetails} columns={columns} />
      </div>
    </main>
  );
};

export default Page;
