import { z } from 'zod';

export const RegionSchema = z.object({
  regionId: z.number().int(),
  provinceFullName: z.string(),
  provinceShortName: z.string(),
  cityFullName: z.string(),
  cityShortName: z.string(),
  relatedRegionIds: z.array(z.number().int()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type RegionType = z.infer<typeof RegionSchema>;

export const Hub = z.object({
  regionHubId: z.number().int(),
  regionId: z.number().int(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type HubType = z.infer<typeof Hub>;

export const HubList = z.array(Hub);
