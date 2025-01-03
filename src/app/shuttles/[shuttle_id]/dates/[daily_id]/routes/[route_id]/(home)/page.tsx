import BlueLink from '@/components/link/BlueLink';
import { getRoute } from '@/services/api/route.services';
import DataTable from '@/components/table/DataTable';
import { busColumns, routeHubColumns } from './types/table.type';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

interface Props {
  params: { shuttle_id: string; daily_id: string; route_id: string };
}

const Page = ({ params: { shuttle_id, daily_id, route_id } }: Props) => {
  const {
    data: route,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['routes', shuttle_id, daily_id, route_id],
    queryFn: () =>
      getRoute(Number(shuttle_id), Number(daily_id), Number(route_id)),
  });

  if (isPending) return <p>로딩중...</p>;
  if (isError) return <p>에러 : {error.message}</p>;

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">노선 상세</h1>
      </header>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <BlueLink href={`/shuttles/${route.shuttleId}`}>셔틀</BlueLink>
        <BlueLink
          href={`/shuttles/${route.shuttleId}/dates/${route.dailyShuttleId}`}
        >
          일일 셔틀
        </BlueLink>
      </div>
      <div className="flex flex-col gap-16">
        <div className="grid grid-cols-4 gap-4 bg-grey-50 p-16 rounded-xl">
          <ul>
            <li>노선 ID: {route.shuttleRouteId}</li>
            <li>노선 이름: {route.name}</li>
            <li>최대 승객 수: {route.maxPassengerCount}</li>
          </ul>
          <ul>
            <li>얼리버드 여부: {route.hasEarlybird ? 'O' : 'X'}</li>
            {route.hasEarlybird && (
              <>
                <li>
                  얼리버드 예약 마감일:{' '}
                  {dayjs(route.earlybirdDeadline).format('YYYY-MM-DD')}
                </li>
                <li>
                  귀가행 얼리버드 가격: {route.earlybirdPriceFromDestination}
                </li>
                <li>
                  목적지행 얼리버드 가격: {route.earlybirdPriceToDestination}
                </li>
                <li>왕복 가격: {route.earlybirdPriceRoundTrip}</li>
              </>
            )}
          </ul>
          <ul>
            <li>
              에약 마감일:{' '}
              {dayjs(route.reservationDeadline).format('YYYY-MM-DD')}
            </li>
            <li>귀가행 가격: {route.regularPriceFromDestination}</li>
            <li>목적지행 가격: {route.regularPriceToDestination}</li>
            <li>왕복 가격: {route.regularPriceRoundTrip}</li>
          </ul>
          <ul>
            <li>상태: {route.status}</li>
          </ul>
        </div>

        <header className="flex flex-row justify-between">
          <h3 className="text-[24px] font-500">거점지 - 목적지행</h3>
        </header>
        <DataTable columns={routeHubColumns} data={route.hubs.toDestination} />

        <header className="flex flex-row justify-between">
          <h3 className="text-[24px] font-500">거점지 - 귀가행</h3>
        </header>
        <DataTable
          columns={routeHubColumns}
          data={route.hubs.fromDestination}
        />

        <header className="flex flex-row justify-between">
          <h3 className="text-[24px] font-500">버스 목록 ({0})</h3>
          <BlueLink href={`${route_id}/buses/new`}>추가하기</BlueLink>
        </header>
        <DataTable columns={busColumns} data={route.shuttleBuses} />
      </div>
    </main>
  );
};

export default Page;
