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
  shuttleId: z.number().int(),
  name: z.string(),
  dailyShuttles: z.array(DailyShuttleSchema),
  image: z.string().url(),
  status: z.enum(['OPEN', 'CLOSED', 'ENDED', 'INACTIVE']),
  destination: DestinationSchema,
  type: z.enum(['CONCERT', 'FESTIVAL']),
  participants: z.array(ParticipantSchema),
  totalDemandCount: z.number().int(),
});

export const ShuttleListSchema = z.array(ShuttleSchema);

export type ShuttleType = z.infer<typeof ShuttleSchema>;

//////////////// create shuttle action ///////////////

const CreateConcertShuttleRequestSchema = z.object({
  name: z.string(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  dailyShuttles: z.array(z.object({ date: z.coerce.date() })),
  type: z.enum(['CONCERT']),
  concert: z.object({
    image: z.string().url(),
    name: z.string(),
    concertArtistIds: z.array(z.number().int()),
  }),
});

const CreateFestivalShuttleRequestSchema = z.object({
  name: z.string(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  dailyShuttles: z.array(z.object({ date: z.coerce.date() })),
  type: z.enum(['FESTIVAL']),
  festival: z.object({
    image: z.string().url(),
    name: z.string(),
    festivalArtistIds: z.array(z.number().int()),
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
