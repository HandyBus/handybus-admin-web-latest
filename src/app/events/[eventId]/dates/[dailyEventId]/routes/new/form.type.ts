import { z } from 'zod';

export const CreateShuttleRouteFormValuesSchema = z.object({
  name: z.string(),
  reservationDeadline: z.string(),
  hasEarlybird: z.boolean(),
  earlybirdPrice: z.object({
    toDestination: z.number(),
    fromDestination: z.number(),
    roundTrip: z.number(),
  }),
  regularPrice: z.object({
    toDestination: z.number(),
    fromDestination: z.number(),
    roundTrip: z.number(),
  }),
  earlybirdDeadline: z.string(),
  maxPassengerCount: z.number(),
  shuttleRouteHubsToDestination: z.array(
    z.object({
      regionId: z.string().nullable(),
      regionHubId: z.string().nullable(),
      arrivalTime: z.string(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
    }),
  ),
  shuttleRouteHubsFromDestination: z.array(
    z.object({
      regionId: z.string().nullable(),
      regionHubId: z.string().nullable(),
      arrivalTime: z.string(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
    }),
  ),
});

export type CreateShuttleRouteFormValues = z.infer<
  typeof CreateShuttleRouteFormValuesSchema
>;
