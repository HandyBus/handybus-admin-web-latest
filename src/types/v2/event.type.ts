import { z } from 'zod';

const EventDailyShuttlesInEventsViewEntity = z
  .object({
    dailyEventId: z.number().int(),
    date: z.coerce.date(),
    status: z.enum(['OPEN', 'CLOSED', 'ENDED', 'INACTIVE']),
  })
  .strict();

const ArtistsInEventsViewEntity = z
  .object({
    artistId: z.number().int(),
    artistName: z.string(),
  })
  .strict();

export const EventsViewEntity = z
  .object({
    eventId: z.number().int(),
    eventName: z.string(),
    eventType: z.enum(['CONCERT', 'FESTIVAL']),
    regionId: z.number().int(),
    regionHubId: z.number().int(),
    eventStatus: z.enum(['OPEN', 'CLOSED', 'ENDED', 'INACTIVE']),
    eventImageUrl: z.string().url(),
    eventLocationName: z.string(),
    eventLocationAddress: z.string(),
    eventLocationLatitude: z.number(),
    eventLocationLongitude: z.number(),
    eventArtists: ArtistsInEventsViewEntity.array().nullable(),
    dailyEvents: EventDailyShuttlesInEventsViewEntity.array(),
  })
  .strict();

export type EventsViewType = z.infer<typeof EventsViewEntity>;
