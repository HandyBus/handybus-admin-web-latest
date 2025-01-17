import BusTable from './components/BusTable';
import ReservationTable from './components/ReservationTable';

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

  return (
    <>
      <main className="flex h-full w-full flex-col gap-16 bg-white">
        <h1 className="text-[32px] font-500 flex items-center">
          노선별 예약 관리
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
