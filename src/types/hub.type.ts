import { z } from 'zod';

// ----- GET -----

export const RouteHubSchema = z.object({
  shuttleRouteHubId: z.number().int(),
  name: z.string(),
  sequence: z.number().int().positive(),
  regionId: z.number().int(),
  regionHubId: z.number().int(),
  arrivalTime: z.string(),
});
export type RouteHubType = z.infer<typeof RouteHubSchema>;

export const RegionHubSchema = z.object({
  regionHubId: z.number().int(),
  regionId: z.number().int(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type RegionHub = z.infer<typeof RegionHubSchema>;

// ----- POST & PUT -----

export const CreateHubRequestSchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
export type CreateHubRequest = z.infer<typeof CreateHubRequestSchema>;
