import { z } from 'zod';

import { DailyShuttleSchema } from './dailyShuttle.type';

const DestinationSchema = z.object({
  name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
});

const ParticipantSchema = z.object({
  name: z.string(),
});

export const ShuttleSchema = z.object({
  shuttleID: z.number().int(),
  name: z.string(),
  dailyShuttles: z.array(DailyShuttleSchema),
  image: z.string().url(),
  status: z.enum(['OPEN', 'CLOSED', 'ENDED', 'INACTIVE']),
  destination: DestinationSchema,
  type: z.enum(['CONCERT', 'FESTIVAL']),
  participants: z.array(ParticipantSchema),
  totalDemandCount: z.number().int(),
});

export const ShuttlesSchema = z.array(ShuttleSchema);

export type ShuttleType = z.infer<typeof ShuttleSchema>;

//////////////// create shuttle action ///////////////

const CreateConcertShuttleRequestSchema = z.object({
  name: z.string(),
  regionID: z.number().int(),
  regionHubID: z.number().int(),
  dailyShuttles: z.array(z.object({ date: z.coerce.date() })),
  type: z.enum(['CONCERT']),
  concert: z.object({
    image: z.string().url(),
    name: z.string(),
    concertArtistIDs: z.array(z.number().int()),
  }),
});

const CreateFestivalShuttleRequestSchema = z.object({
  name: z.string(),
  regionID: z.number().int(),
  regionHubID: z.number().int(),
  dailyShuttles: z.array(z.object({ date: z.coerce.date() })),
  type: z.enum(['FESTIVAL']),
  festival: z.object({
    image: z.string().url(),
    name: z.string(),
    festivalArtistIDs: z.array(z.number().int()),
  }),
});

export const CreateShuttleRequestSchema = z.discriminatedUnion('type', [
  CreateConcertShuttleRequestSchema,
  CreateFestivalShuttleRequestSchema,
]);

export type CreateShuttleRequestType = z.infer<
  typeof CreateShuttleRequestSchema
>;

////////////////// ////////////////// //////////////////
