import { CreateEventRequest } from '@/types/v2/event.type';
import { z } from 'zod';

export const CreateEventFormSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  dailyEvents: z.object({ date: z.date() }).array(),
  type: z.enum(['CONCERT', 'FESTIVAL']),
  // to work with react-hook-form
  artistIds: z.array(z.object({ artistId: z.number().int().nullable() })),
});

export type CreateEventFormData = z.infer<typeof CreateEventFormSchema>;

export const conform = (data: CreateEventFormData): CreateEventRequest => {
  const artistIds = data.artistIds.filter(
    (artist): artist is { artistId: number } => artist.artistId !== null,
  );
  return {
    ...data,
    artistIds: artistIds.map((artist) => artist.artistId),
  } satisfies CreateEventRequest;
};
