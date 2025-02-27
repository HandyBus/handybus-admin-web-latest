import { CreateEventRequest } from '@/types/event.type';
import { z } from 'zod';
import { convertToUTC } from '@/utils/date.util';

export const CreateEventFormSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
  regionId: z.string(),
  regionHubId: z.string(),
  dailyEvents: z.object({ date: z.string() }).array(),
  type: z.enum(['CONCERT', 'FESTIVAL']),
  // to work with react-hook-form
  artistIds: z.array(z.object({ artistId: z.string().nullable() })),
});

export type CreateEventFormData = z.infer<typeof CreateEventFormSchema>;

export const conform = (data: CreateEventFormData): CreateEventRequest => {
  const artistIds = data.artistIds.filter(
    (artist): artist is { artistId: string } => artist.artistId !== null,
  );
  const dailyEvents = data.dailyEvents.map((daily) => ({
    ...daily,
    date: convertToUTC(daily.date),
  }));
  return {
    ...data,
    artistIds: artistIds.map((artist) => artist.artistId),
    dailyEvents,
  } satisfies CreateEventRequest;
};
