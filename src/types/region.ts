import { z } from 'zod';

// TODO 추후 마이그레이션
export const RegionSchema = z.object({
  regionId: z.string(),
  provinceFullName: z.string(),
  provinceShortName: z.string(),
  cityFullName: z.string(),
  cityShortName: z.string(),
  relatedRegionIds: z.array(z.number().int()),
  createdAt: z.string(),
  updatedAt: z.string(),
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
