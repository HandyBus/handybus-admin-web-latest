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
  artistIds: z.array(z.object({ artistId: z.number().int() })),
});

export type CreateEventFormData = z.infer<typeof CreateEventFormSchema>;

export const conform = (data: CreateEventFormData): CreateEventRequest => {
  return {
    ...data,
    artistIds: data.artistIds.map(({ artistId }) => artistId),
  } satisfies CreateEventRequest;
};
