import { z } from 'zod';

export const Region = z.object({
  ID: z.number().int(),
  provinceFullName: z.string(),
  provinceShortName: z.string(),
  cityFullName: z.string(),
  cityShortName: z.string(),
  relatedRegionIDs: z.array(z.number().int()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const RegionList = z.array(Region);

export type RegionType = z.infer<typeof Region>;

export const Hub = z.object({
  ID: z.number().int(),
  regionID: z.number().int(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type HubType = z.infer<typeof Hub>;

export const HubList = z.array(Hub);
