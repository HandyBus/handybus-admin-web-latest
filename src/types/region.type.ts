import { z } from 'zod';

export const RegionSchema = z.object({
  regionId: z.string(),
  provinceFullName: z.string(),
  provinceShortName: z.string(),
  cityFullName: z.string(),
  cityShortName: z.string(),
  relatedRegionIds: z.string().array(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Region = z.infer<typeof RegionSchema>;

export const RegionHubsViewEntitySchema = z.object({
  regionHubId: z.string(),
  regionId: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});
export type RegionHubsViewEntity = z.infer<typeof RegionHubsViewEntitySchema>;
