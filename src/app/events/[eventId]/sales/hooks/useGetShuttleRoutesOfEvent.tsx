'use client';

import { getShuttleRoutesOfDailyEvent } from '@/services/shuttleRoute.service';
import { EventsViewEntity } from '@/types/event.type';
import { useQuery } from '@tanstack/react-query';

const useGetShuttleRoutesOfEvent = (
  event: EventsViewEntity | null | undefined,
) => {
  const enabled = !!event;

  const queryFn = async () => {
    if (!event) {
      return [];
    }
    const dailyEventIds = event.dailyEvents.map(
      (dailyEvent) => dailyEvent.dailyEventId,
    );
    const routes = await Promise.all(
      dailyEventIds.map((dailyEventId) =>
        getShuttleRoutesOfDailyEvent(event.eventId, dailyEventId),
      ),
    );
    return routes.flat();
  };

  return useQuery({
    queryKey: ['shuttle-routes', event?.eventId],
    queryFn,
    enabled,
  });
};

export default useGetShuttleRoutesOfEvent;
