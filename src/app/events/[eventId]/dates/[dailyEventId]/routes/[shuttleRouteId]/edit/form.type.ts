import { z } from 'zod';

export const EditFormSchema = z.object({
  name: z.string(),
  reservationDeadline: z.string(),
  hasEarlybird: z.boolean(),
  earlybirdDeadline: z.string().optional(),
  maxPassengerCount: z.number().int(),
  shuttleRouteHubsFromDestination: z.array(
    z.object({
      shuttleRouteHubId: z.string().optional(),
      regionHubId: z.string(),
      regionId: z.string().optional(),
      arrivalTime: z.string(),
    }),
  ),
  shuttleRouteHubsToDestination: z.array(
    z.object({
      shuttleRouteHubId: z.string().optional(),
      regionHubId: z.string(),
      regionId: z.string().optional(),
      arrivalTime: z.string(),
    }),
  ),
  regularPrice: z.object({
    roundTrip: z.number().int(),
    toDestination: z.number().int(),
    fromDestination: z.number().int(),
  }),
  earlybirdPrice: z
    .object({
      roundTrip: z.number().int(),
      toDestination: z.number().int(),
      fromDestination: z.number().int(),
    })
    .optional(),
});

export type EditFormData = z.infer<typeof EditFormSchema>;
