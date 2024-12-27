import BlueLink from '@/components/link/BlueLink';
import { getRoute } from '@/app/actions/route.action';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';

interface Props {
  params: { shuttle_id: string; daily_id: string; route_id: string };
}

const Page = async ({ params: { shuttle_id, daily_id, route_id } }: Props) => {
  const route = await getRoute(shuttle_id, daily_id, route_id);

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">노선 상세</h1>
      </header>
      <div className="flex flex-col gap-16">
        <pre className="p-8 bg-grey-50 rounded-lg">
          {JSON.stringify(route.shuttleRouteDetail, null, 2)}
        </pre>

        <header className="flex flex-row justify-between">
          <h1 className="text-[24px] font-500">버스 목록</h1>
          <BlueLink href={`${route_id}/buses/new`}>추가하기</BlueLink>
        </header>

        <DataTable
          columns={columns}
          data={route.shuttleRouteDetail.shuttleBuses}
        />
      </div>
    </main>
  );
};

export default Page;
