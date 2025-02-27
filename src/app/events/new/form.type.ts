import { CreateEventRequest } from '@/types/event.type';
import { z } from 'zod';
import { conformEventData } from '../conform.util';

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
  return conformEventData<CreateEventFormData, CreateEventRequest>(data);
};
