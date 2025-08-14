import { useGetReservationsWithPagination } from '@/services/reservation.service';
import { EventsViewEntity } from '@/types/event.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import { useCallback, useMemo } from 'react';

export interface RouteWithSales extends AdminShuttleRoutesViewEntity {
  totalSales: number;
  totalSalesWithDiscount: number;
  totalPassengerCount: number;
  totalReservationCount: number;
  canceledReservationCount: number;
}

const useGetSales = (
  event: EventsViewEntity,
  shuttleRoutes: AdminShuttleRoutesViewEntity[],
) => {
  const { data: reservationsPages } = useGetReservationsWithPagination({
    eventId: event.eventId,
    reservationStatus: 'COMPLETE_PAYMENT',
  });
  const { data: canceledReservationsPages } = useGetReservationsWithPagination({
    eventId: event.eventId,
    reservationStatus: 'CANCEL',
  });

  const createRoutesWithSales = useCallback(
    (
      reservations: ReservationViewEntity[],
      canceledReservations: ReservationViewEntity[],
    ) => {
      const baseRoutesWithSales: RouteWithSales[] = shuttleRoutes.map((e) => ({
        ...e,
        totalSales: 0,
        totalSalesWithDiscount: 0,
        totalPassengerCount: 0,
        totalReservationCount: 0,
        canceledReservationCount: 0,
      }));

      const routesWithSales = reservations.reduce((acc, reservation) => {
        return acc.map((routeWithSales) => {
          if (routeWithSales.shuttleRouteId !== reservation.shuttleRouteId) {
            return routeWithSales;
          }
          // NOTE: 왕복은 탑승자 수 * 2
          const passengerCount =
            reservation.type === 'ROUND_TRIP'
              ? reservation.passengerCount * 2
              : reservation.passengerCount;
          return {
            ...routeWithSales,
            totalSales:
              routeWithSales.totalSales +
              (reservation.paymentPrincipalAmount ?? 0),
            totalSalesWithDiscount:
              routeWithSales.totalSalesWithDiscount +
              (reservation.paymentAmount ?? 0),
            totalPassengerCount:
              routeWithSales.totalPassengerCount + passengerCount,
            totalReservationCount: routeWithSales.totalReservationCount + 1,
          };
        });
      }, baseRoutesWithSales);

      const routesWithCanceledReservations = canceledReservations.reduce(
        (acc, reservation) => {
          return acc.map((routeWithSales) => {
            if (routeWithSales.shuttleRouteId !== reservation.shuttleRouteId) {
              return routeWithSales;
            }
            return {
              ...routeWithSales,
              canceledReservationCount:
                routeWithSales.canceledReservationCount + 1,
            };
          });
        },
        routesWithSales,
      );

      return routesWithCanceledReservations;
    },
    [shuttleRoutes],
  );

  const dailyEventsWithRoutesWithSales = useMemo(() => {
    const reservations = reservationsPages.pages?.[0]?.reservations;
    const canceledReservations =
      canceledReservationsPages.pages?.[0]?.reservations;

    if (!reservations || !canceledReservations) {
      return [];
    }

    const routesWithSales = createRoutesWithSales(
      reservations,
      canceledReservations,
    );
    const dailyEventWithRoutesWithSales = event.dailyEvents.map(
      (dailyEvent) => {
        const targetRoutes = routesWithSales
          .filter((route) => route.dailyEventId === dailyEvent.dailyEventId)
          .sort((a, b) => a.name.localeCompare(b.name));
        return {
          ...dailyEvent,
          routesWithSales: targetRoutes,
        };
      },
    );
    return dailyEventWithRoutesWithSales;
  }, [
    reservationsPages,
    canceledReservationsPages,
    createRoutesWithSales,
    event.dailyEvents,
  ]);

  return dailyEventsWithRoutesWithSales;
};

export default useGetSales;
