import { z } from 'zod';

const ShuttleEventDailyShuttlesInShuttleEventsViewEntity = z
  .object({
    dailyShuttleId: z.number().int(),
    date: z.coerce.date(),
    status: z.enum(['OPEN', 'CLOSED', 'ENDED', 'INACTIVE']),
  })
  .strict();

const ShuttleEventArtistsInShuttleEventsViewEntity = z
  .object({
    artistId: z.number().int(),
    artistName: z.string(),
  })
  .strict();

export const ShuttleEventsViewEntity = z
  .object({
    shuttleId: z.number().int(),
    shuttleName: z.string(),
    shuttleType: z.enum(['CONCERT', 'FESTIVAL']),
    regionId: z.number().int(),
    regionHubId: z.number().int(),
    shuttleStatus: z.enum(['OPEN', 'CLOSED', 'ENDED', 'INACTIVE']),
    destinationName: z.string(),
    destinationAddress: z.string(),
    destinationLatitude: z.number(),
    destinationLongitude: z.number(),
    eventName: z.string(),
    eventImageUrl: z.string().url(),
    // TODO check if it is okay to remove .nullable() after bug fix
    eventArtists:
      ShuttleEventArtistsInShuttleEventsViewEntity.array().nullable(),
    dailyShuttles: ShuttleEventDailyShuttlesInShuttleEventsViewEntity.array(),
  })
  .strict();

export type ShuttleEventsViewType = z.infer<typeof ShuttleEventsViewEntity>;
