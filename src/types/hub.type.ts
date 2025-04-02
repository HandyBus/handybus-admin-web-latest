import { z } from 'zod';

// ----- GET -----

export const RouteHubSchema = z.object({
  shuttleRouteHubId: z.string(),
  name: z.string(),
  sequence: z.number().int().positive(),
  regionId: z.string(),
  regionHubId: z.string(),
  arrivalTime: z.string(),
});
export type RouteHubType = z.infer<typeof RouteHubSchema>;

export const RegionHubSchema = z.object({
  regionHubId: z.string(),
  regionId: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  eventDestination: z.boolean(),
  shuttleHub: z.boolean(),
});
export type RegionHub = z.infer<typeof RegionHubSchema>;

// ----- POST -----

export const CreateHubRequestSchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
export type CreateHubRequest = z.infer<typeof CreateHubRequestSchema>;

export const AdminUpdateRegionHubRequestSchema = z
  .object({
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    regionId: z.string(),
  })
  .partial();
export type AdminUpdateRegionHubRequest = z.infer<
  typeof AdminUpdateRegionHubRequestSchema
>;
