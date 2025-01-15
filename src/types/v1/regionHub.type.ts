import { z } from 'zod';

export const RegionHubSchema = z.object({
  regionHubId: z.number().int(),
  regionId: z.number().int(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type RegionHub = z.infer<typeof RegionHubSchema>;

//////////////// create hub action ///////////////

export const CreateHubRequestSchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export type CreateHubRequestType = z.infer<typeof CreateHubRequestSchema>;
