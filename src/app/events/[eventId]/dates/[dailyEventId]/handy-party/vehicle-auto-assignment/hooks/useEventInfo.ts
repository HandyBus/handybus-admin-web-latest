import { useMemo } from 'react';
import { useGetShuttleRoutesOfDailyEvent } from '@/services/shuttleRoute.service';
import dayjs from 'dayjs';

interface UseEventInfoProps {
  eventId: string;
  dailyEventId: string;
}

export const useEventInfo = ({ eventId, dailyEventId }: UseEventInfoProps) => {
  const {
    data: shuttleRoutes,
    isLoading: isLoadingShuttleRoutes,
    isError: isErrorShuttleRoutes,
  } = useGetShuttleRoutesOfDailyEvent(eventId, dailyEventId);

  const eventInfo = useMemo(() => {
    if (!shuttleRoutes) return;

    const dailyEvent = shuttleRoutes?.[0]?.event.dailyEvents.find(
      (dailyEvent) => dailyEvent.dailyEventId === dailyEventId,
    );

    return {
      eventName: shuttleRoutes?.[0]?.event.eventName,
      eventLocationName: shuttleRoutes?.[0]?.event.eventLocationName,
      date: dayjs(dailyEvent?.dailyEventDate).format('YYYY-MM-DD'),
    };
  }, [shuttleRoutes, dailyEventId]);

  return {
    eventInfo,
    shuttleRoutes,
    isLoadingShuttleRoutes,
    isErrorShuttleRoutes,
  };
};
