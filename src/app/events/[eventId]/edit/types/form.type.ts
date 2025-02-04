import { z } from 'zod';
import {
  EventStatusEnum,
  EventTypeEnum,
  UpdateEventRequest,
} from '@/types/event.type';

export const EditEventFormSchema = z.object({
  status: EventStatusEnum,
  name: z.string(),
  imageUrl: z.string().url(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  dailyEvents: z
    .object({
      status: EventStatusEnum.optional(),
      dailyEventId: z.number().int().optional(),
      date: z.string(),
    })
    .array(),
  type: EventTypeEnum,
  artistIds: z.array(z.object({ artistId: z.number().int().nullable() })),
});

export type EditEventFormData = z.infer<typeof EditEventFormSchema>;

export const conform = (data: EditEventFormData): UpdateEventRequest => {
  const artistIds = data.artistIds.filter(
    (artist): artist is { artistId: number } => artist.artistId !== null,
  );
  return {
    ...data,
    artistIds: artistIds.map((artist) => artist.artistId),
  } satisfies UpdateEventRequest;
};
