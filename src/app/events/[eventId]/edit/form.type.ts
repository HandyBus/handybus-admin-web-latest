import { z } from 'zod';
import {
  EventStatusEnum,
  EventTypeEnum,
  UpdateEventRequest,
} from '@/types/event.type';
import { convertToUTC } from '@/utils/date.util';

export const EditEventFormSchema = z.object({
  status: EventStatusEnum,
  name: z.string(),
  imageUrl: z.string().url(),
  regionId: z.string(),
  regionHubId: z.string(),
  dailyEvents: z
    .object({
      status: EventStatusEnum.optional(),
      dailyEventId: z.string().optional(),
      date: z.string(),
    })
    .array(),
  type: EventTypeEnum,
  artistIds: z.array(z.object({ artistId: z.string().nullable() })),
});

export type EditEventFormData = z.infer<typeof EditEventFormSchema>;

export const conform = (data: EditEventFormData): UpdateEventRequest => {
  const artistIds = data.artistIds.filter(
    (artist): artist is { artistId: string } => artist.artistId !== null,
  );
  const dailyEvents = data.dailyEvents.map((daily) => ({
    ...daily,
    date: convertToUTC(daily.date),
  }));
  console.log('in conform dailyEvents', dailyEvents);
  return {
    ...data,
    artistIds: artistIds.map((artist) => artist.artistId),
    dailyEvents,
  } satisfies UpdateEventRequest;
};
