'use client';

import BlueLink from '@/components/link/BlueLink';
import { routeHubColumns } from './types/table.type';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getRoute } from '@/services/v2/shuttleRoute.services';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';
import Buses from './components/Buses';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
}

const Page = ({ params: { eventId, dailyEventId, shuttleRouteId } }: Props) => {
  const {
    data: route,
    isPending: isRoutePending,
    isError: isRouteError,
    error: routeError,
  } = useQuery({
    queryKey: ['routes', eventId, dailyEventId, shuttleRouteId],
    queryFn: () =>
      getRoute(Number(eventId), Number(dailyEventId), Number(shuttleRouteId)),
  });

  const fromHubTable = useTable({
    data: route ? route.fromDestinationShuttleRouteHubs : [],
    columns: routeHubColumns,
  });

  const toHubTable = useTable({
    data: route?.toDestinationShuttleRouteHubs ?? [],
    columns: routeHubColumns,
  });

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <h1 className="text-[32px] font-500">노선 상세</h1>
      </header>
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <BlueLink href={`/events/${eventId}`}>이벤트</BlueLink>
        <BlueLink href={`/events/${eventId}/dates/${dailyEventId}`}>
          해당 일자 이벤트
        </BlueLink>
      </div>
      {isRoutePending && <div>Loading...</div>}
      {isRouteError && <div>Error: {routeError.message}</div>}
      {route && (
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
          <BaseTable table={fromHubTable} />

          <header className="flex flex-row justify-between">
            <h3 className="text-[24px] font-500">거점지 - 귀가행</h3>
          </header>
          <BaseTable table={toHubTable} />

          <Buses
            eventId={eventId}
            dailyEventId={dailyEventId}
            shuttleRouteId={shuttleRouteId}
          />
        </div>
      )}
    </main>
  );
};

export default Page;
