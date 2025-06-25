import { CreateEventRequest } from '@/types/event.type';
import dayjs from 'dayjs';
import { z } from 'zod';

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
  // TODO: 추후 일자별 행사 수요조사 종료 시간을 폼에 추가해야 함
  const dailyEvents = data.dailyEvents.map((dailyEvent) => ({
    ...dailyEvent,
    closeDeadline: dayjs(dailyEvent.date).subtract(14, 'day').toISOString(),
  }));
  return {
    ...data,
    artistIds: artistIds.map((artist) => artist.artistId),
    dailyEvents,
    isPinned: false,
  } satisfies CreateEventRequest;
};
