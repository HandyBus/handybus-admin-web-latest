import { CreateEventFormData } from '@/app/events/new/form.type';
import { EditEventFormData } from '@/app/events/[eventId]/edit/form.type';
import { CreateEventRequest, UpdateEventRequest } from '@/types/event.type';
import dayjs from 'dayjs';

type EventFormData = CreateEventFormData | EditEventFormData;
type EventRequest = CreateEventRequest | UpdateEventRequest;

export const conformEventData = <
  T extends EventFormData,
  R extends EventRequest,
>(
  data: T,
): R => {
  const artistIds = data.artistIds.filter(
    (artist): artist is { artistId: string } => artist.artistId !== null,
  );

  const dailyEvents = data.dailyEvents.map((daily) => ({
    ...daily,
    date: dayjs.tz(daily.date, 'Asia/Seoul').toISOString(),
  }));

  const result = {
    ...data,
    artistIds: artistIds.map((artist) => artist.artistId),
    dailyEvents,
  } satisfies EventRequest;

  return result as R;
};
