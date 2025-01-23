import { z } from 'zod';

export const UpdateShuttleRouteRequestFormSchema = z.object({
  name: z.string(),
  reservationDeadline: z.string(),
  maxPassengerCount: z.number().int(),
  shuttleRouteHubsFromDestination: z.array(
    z.object({
      shuttleRouteHubId: z.number().int().optional(),
      regionHubId: z.number().int(),
      regionId: z.number().int().optional(),
      arrivalTime: z.string(),
    }),
  ),
  shuttleRouteHubsToDestination: z.array(
    z.object({
      shuttleRouteHubId: z.number().int().optional(),
      regionHubId: z.number().int(),
      regionId: z.number().int().optional(),
      arrivalTime: z.string(),
    }),
  ),
});

export type UpdateShuttleRouteRequestFormData = z.infer<
  typeof UpdateShuttleRouteRequestFormSchema
>;
