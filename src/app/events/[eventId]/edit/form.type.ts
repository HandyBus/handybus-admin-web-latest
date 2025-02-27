import { z } from 'zod';
import {
  EventStatusEnum,
  EventTypeEnum,
  UpdateEventRequest,
} from '@/types/event.type';
import { conformEventData } from '../../conform.util';

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
  return conformEventData<EditEventFormData, UpdateEventRequest>(data);
};
