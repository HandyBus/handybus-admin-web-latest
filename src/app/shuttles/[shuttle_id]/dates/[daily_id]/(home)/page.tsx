import BlueLink from '@/components/link/BlueLink';
import { getShuttle } from '@/app/actions/shuttle.action';
import Shuttle from '@/app/shuttles/[shuttle_id]/(home)/components/Shuttle';
import { getAllRoutes } from '@/app/actions/route.action';
import { notFound } from 'next/navigation';

interface Props {
  params: { shuttle_id: string; daily_id: string };
}

const Page = async ({ params: { shuttle_id, daily_id } }: Props) => {
  const [shuttle, routes] = await Promise.all([
    getShuttle(Number(shuttle_id)),
    getAllRoutes(shuttle_id, daily_id),
  ]);

  const thisDailyShuttle = shuttle.dailyShuttles.find(
    (d) => d.id === Number(daily_id),
  );

  if (!thisDailyShuttle) {
    notFound();
  }

  return (
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
      <pre>
        {
          // TODO use pretty-table later
          JSON.stringify(routes, null, 2)
        }
      </pre>
    </div>
  );
};

export default Page;
