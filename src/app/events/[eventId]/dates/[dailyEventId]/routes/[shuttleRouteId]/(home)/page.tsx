'use client';

import BlueLink from '@/components/link/BlueLink';
import { routeHubColumns } from './types/table.type';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';
import Buses from './components/Buses';
import { formatDateString } from '@/utils/date.util';
import { useGetShuttleRoute } from '@/services/shuttleOperation.service';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import List from '@/components/text/List';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
}

const Page = ({ params: { eventId, dailyEventId, shuttleRouteId } }: Props) => {
  const {
    data: route,
    isPending: isRoutePending,
    isError: isRouteError,
    error: routeError,
  } = useGetShuttleRoute(
    Number(eventId),
    Number(dailyEventId),
    Number(shuttleRouteId),
  );

  const fromHubTable = useTable({
    data: route?.fromDestinationShuttleRouteHubs.sort(
      (a, b) => a.sequence - b.sequence,
    ),
    columns: routeHubColumns,
  });

  const toHubTable = useTable({
    data: route?.toDestinationShuttleRouteHubs.sort(
      (a, b) => a.sequence - b.sequence,
    ),
    columns: routeHubColumns,
  });

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex flex-row justify-between">
        <Heading>노선 정보</Heading>
        <BlueLink
          href={`/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/edit`}
          className="text-[24px] font-500"
        >
          수정하기
        </BlueLink>
      </header>

      {isRoutePending && <div>Loading...</div>}
      {isRouteError && <div>Error: {routeError.message}</div>}
      {route && (
        <div className="flex flex-col gap-16">
          <Callout>
            <div className="grid grid-cols-4 gap-16 p-8">
              <List className="grid-cols-[90px_1fr]">
                <List.item title="행사명">
                  <BlueLink href={`/events/${eventId}`}>
                    {route.event.eventName}
                  </BlueLink>
                </List.item>
                <List.item title="노선 ID">{route.shuttleRouteId}</List.item>
                <List.item title="노선 이름">{route.name}</List.item>
                <List.item title="날짜">
                  <BlueLink href={`/events/${eventId}/dates/${dailyEventId}`}>
                    {formatDateString(
                      route?.event?.dailyEvents.find(
                        (dailyEvent) =>
                          dailyEvent.dailyEventId === Number(dailyEventId),
                      )?.date,
                      'date',
                    )}
                  </BlueLink>
                </List.item>{' '}
                <List.item title="최대 승객 수">
                  {route.maxPassengerCount}
                </List.item>
              </List>
              <List className="grid-cols-[160px_1fr]">
                <List.item title="얼리버드 여부">
                  {route.hasEarlybird ? 'O' : 'X'}
                </List.item>
                {route.hasEarlybird && (
                  <>
                    <List.item title="얼리버드 예약 마감일">
                      {formatDateString(route.earlybirdDeadline)}
                    </List.item>
                    <List.item title="귀가행 얼리버드 가격">
                      {route.earlybirdPriceFromDestination}
                    </List.item>
                    <List.item title="목적지행 얼리버드 가격">
                      {route.earlybirdPriceToDestination}
                    </List.item>
                    <List.item title="왕복 얼리버드 가격">
                      {route.earlybirdPriceRoundTrip}
                    </List.item>
                  </>
                )}
              </List>
              <List className="grid-cols-[102px_1fr]">
                <List.item title="예약 마감일">
                  {formatDateString(route.reservationDeadline)}
                </List.item>
                <List.item title="귀가행 가격">
                  {route.regularPriceFromDestination}
                </List.item>
                <List.item title="목적지행 가격">
                  {route.regularPriceToDestination}
                </List.item>
                <List.item title="왕복 가격">
                  {route.regularPriceRoundTrip}
                </List.item>
              </List>
              <List className="grid-cols-[72px_1fr]">
                <List.item title="상태">{route.status}</List.item>
              </List>
            </div>
          </Callout>

          <header className="flex flex-row justify-between">
            <h3 className="text-[24px] font-500">거점지 - 목적지행</h3>
          </header>
          <BaseTable table={toHubTable} />

          <header className="flex flex-row justify-between">
            <h3 className="text-[24px] font-500">거점지 - 귀가행</h3>
          </header>
          <BaseTable table={fromHubTable} />

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
