import { z } from 'zod';

export const HubUsageTypeEnum = z.enum([
  'SHUTTLE_HUB',
  'EVENT_LOCATION',
  'EVENT_PARKING_LOT',
  'HANDY_PARTY',
]);
export type HubUsageType = z.infer<typeof HubUsageTypeEnum>;

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

export const RegionHubsViewEntitySchema = z.object({
  regionHubId: z.string(),
  regionId: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  eventLocation: z.boolean(),
  eventParkingLot: z.boolean(),
  shuttleHub: z.boolean(),
  handyParty: z.boolean(),
});
export type RegionHubsViewEntity = z.infer<typeof RegionHubsViewEntitySchema>;

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
