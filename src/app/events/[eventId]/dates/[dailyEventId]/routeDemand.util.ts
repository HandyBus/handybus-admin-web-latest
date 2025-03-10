const SHUTTLE_ROUTE_DEMAND_KEY = 'shuttleRouteDemand';

interface ShuttleRouteIdentifier {
  eventId: string;
  dailyEventId: string;
  shuttleRouteId: string;
}

const createShuttleRouteDemandKey = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
}: ShuttleRouteIdentifier) =>
  `${SHUTTLE_ROUTE_DEMAND_KEY}-${eventId}-${dailyEventId}-${shuttleRouteId}`;

export const getShuttleRouteDemand = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
}: ShuttleRouteIdentifier) => {
  const shuttleRouteDemandKey = createShuttleRouteDemandKey({
    eventId,
    dailyEventId,
    shuttleRouteId,
  });
  const shuttleRouteDemand = localStorage.getItem(shuttleRouteDemandKey);
  return shuttleRouteDemand !== null && shuttleRouteDemand !== undefined
    ? Number(shuttleRouteDemand)
    : null;
};

export const setShuttleRouteDemand = (
  demand: number,
  { eventId, dailyEventId, shuttleRouteId }: ShuttleRouteIdentifier,
) => {
  const shuttleRouteDemandKey = createShuttleRouteDemandKey({
    eventId,
    dailyEventId,
    shuttleRouteId,
  });
  localStorage.setItem(shuttleRouteDemandKey, demand.toString());
};

export const removeShuttleRouteDemand = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
}: ShuttleRouteIdentifier) => {
  const shuttleRouteDemandKey = createShuttleRouteDemandKey({
    eventId,
    dailyEventId,
    shuttleRouteId,
  });
  localStorage.removeItem(shuttleRouteDemandKey);
};
