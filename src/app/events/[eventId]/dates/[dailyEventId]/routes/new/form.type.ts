import { z } from 'zod';

export const CreateShuttleRouteFormSchema = z.object({
  name: z.string(),
  reservationDeadline: z.coerce.date(),
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
  earlybirdDeadline: z.coerce.date(),
  maxPassengerCount: z.number(),
  shuttleRouteHubsToDestination: z.array(
    z.object({
      regionHubId: z.number().nullable(),
      arrivalTime: z.coerce.date(),
    }),
  ),
  shuttleRouteHubsFromDestination: z.array(
    z.object({
      regionHubId: z.number().nullable(),
      arrivalTime: z.coerce.date(),
    }),
  ),
});

export type CreateShuttleRouteForm = z.infer<
  typeof CreateShuttleRouteFormSchema
>;
