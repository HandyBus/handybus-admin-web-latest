'use client';

import BlueLink from '@/components/link/BlueLink';
import { routeHubColumns, shuttleRouteColumns } from './table.type';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';
import Buses from './components/Buses';
import { useGetShuttleRoute } from '@/services/shuttleRoute.service';
import Heading from '@/components/text/Heading';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import { useMemo } from 'react';
import VerticalTable from '@/components/table/VerticalTable';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
}

const Page = ({ params: { eventId, dailyEventId, shuttleRouteId } }: Props) => {
  const { data: route } = useGetShuttleRoute(
    eventId,
    dailyEventId,
    shuttleRouteId,
  );

  const { data: reservationsPages } = useGetReservationsWithPagination({
    eventId,
    dailyEventId,
    shuttleRouteId,
    reservationStatus: 'COMPLETE_PAYMENT',
  });

  const createRouteWithSales = () => {
    const reservations = reservationsPages.pages?.[0]?.reservations;
    if (!route || !reservations) {
      return;
    }
    const sales = reservations.reduce(
      (acc, reservation) => {
        return {
          totalSales:
            acc.totalSales + (reservation.paymentPrincipalAmount ?? 0),
          totalSalesWithDiscount:
            acc.totalSalesWithDiscount + (reservation.paymentAmount ?? 0),
        };
      },
      { totalSales: 0, totalSalesWithDiscount: 0 },
    );
    return [
      {
        ...route,
        totalSales: sales.totalSales,
        totalSalesWithDiscount: sales.totalSalesWithDiscount,
      },
    ];
  };

  const routeWithSales = useMemo(createRouteWithSales, [
    route,
    reservationsPages,
  ]);

  const routeWithSalesTable = useTable({
    data: routeWithSales,
    columns: shuttleRouteColumns,
  });

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
    <main>
      <Heading className="flex items-baseline gap-20">
        노선 정보
        <BlueLink
          href={`/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}/edit`}
          className="text-14"
        >
          수정하기
        </BlueLink>
      </Heading>
      <div className="flex flex-col gap-16">
        {routeWithSales && (
          <section className="flex flex-col">
            <Heading.h2>상세 정보</Heading.h2>
            <VerticalTable table={routeWithSalesTable} />
          </section>
        )}
        {route && (
          <section className="flex flex-col">
            <Heading.h2>경유지</Heading.h2>
            <Heading.h4>행사장행</Heading.h4>
            <BaseTable table={toHubTable} />
            <Heading.h4>귀가행</Heading.h4>
            <BaseTable table={fromHubTable} />
          </section>
        )}
        <Buses
          eventId={eventId}
          dailyEventId={dailyEventId}
          shuttleRouteId={shuttleRouteId}
        />
      </div>
    </main>
  );
};

export default Page;
