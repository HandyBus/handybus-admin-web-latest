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
    eventImageUrl: z.literal('').or(z.string()),
    eventLocationName: z.string(),
    eventLocationAddress: z.string(),
    eventLocationLatitude: z.number(),
    eventLocationLongitude: z.number(),
    // is this really nullable?
    eventArtists: ArtistsInEventsViewEntity.array().nullable(),
    dailyEvents: EventDailyShuttlesInEventsViewEntity.array(),
  })
  .strict();

export type EventsView = z.infer<typeof EventsViewEntity>;

////////////////////////////////////////

export const CreateEventRequest = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  dailyEvents: z.object({}).array(),
  type: z.enum(['CONCERT', 'FESTIVAL']),
  artistIds: z.number().int().array(),
});

export type CreateEventRequest = z.infer<typeof CreateEventRequest>;
