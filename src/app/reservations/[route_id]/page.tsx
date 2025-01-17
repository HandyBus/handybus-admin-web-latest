'use client';

import { useQuery } from '@tanstack/react-query';
import BusTable from './components/BusTable';
import ReservationTable from './components/ReservationTable';
import { getRoute } from '@/services/v2/shuttleRoute.services';

interface Props {
  params: {
    route_id: string;
  };
  searchParams: {
    eventId: string;
    dailyEventId: string;
  };
}

const Page = ({ params, searchParams }: Props) => {
  const eventId = Number(searchParams.eventId);
  const dailyEventId = Number(searchParams.dailyEventId);
  const shuttleRouteId = Number(params.route_id);

  const { data: shuttleRoute } = useQuery({
    queryKey: ['shuttleRoute', shuttleRouteId],
    queryFn: () => getRoute(eventId, dailyEventId, shuttleRouteId),
  });

  const eventName = shuttleRoute?.event?.eventName;
  const dailyEventDate = new Date(
    shuttleRoute?.event?.dailyEvents.find(
      (dailyEvent) => dailyEvent.dailyEventId === dailyEventId,
    )?.date ?? '',
  ).toLocaleDateString();
  const shuttleRouteName = shuttleRoute?.name;

  return (
    <>
      <main className="flex h-full w-full flex-col gap-16 bg-white">
        <h1 className="text-[32px] font-500 flex items-end">
          노선별 예약 관리
          {shuttleRoute && (
            <p className="flex items-center gap-8 ml-20">
              <span className="text-16 font-500 text-grey-800">
                {eventName}
              </span>
              <span className="text-14 font-400 text-grey-600">
                {dailyEventDate}
              </span>
              <span className="text-14 font-500 text-grey-700">
                {shuttleRouteName}
              </span>
            </p>
          )}
        </h1>
        <ReservationTable
          eventId={eventId}
          dailyEventId={dailyEventId}
          shuttleRouteId={shuttleRouteId}
        />
        <BusTable
          eventId={eventId}
          dailyEventId={dailyEventId}
          shuttleRouteId={shuttleRouteId}
        />
      </main>
    </>
  );
};

export default Page;
