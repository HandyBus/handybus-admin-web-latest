import { z } from 'zod';

export const RouteHubSchema = z.object({
  shuttleRouteHubId: z.number().int(),
  name: z.string(),
  sequence: z.number().int().positive(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  arrivalTime: z.coerce.date(),
});

export type RouteHubType = z.infer<typeof RouteHubSchema>;
