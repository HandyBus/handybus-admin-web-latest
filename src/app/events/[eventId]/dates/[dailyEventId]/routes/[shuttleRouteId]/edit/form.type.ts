import { z } from 'zod';

export const UpdateShuttleRouteRequestFormSchema = z.object({
  name: z.string(),
  reservationDeadline: z.string(),
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
});

export type UpdateShuttleRouteRequestFormData = z.infer<
  typeof UpdateShuttleRouteRequestFormSchema
>;
