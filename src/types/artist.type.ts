import { z } from 'zod';

export const ArtistsViewEntitySchema = z
  .object({
    artistId: z.number().int(),
    artistName: z.string(),
  })
  .strict();

export type ArtistsViewEntity = z.infer<typeof ArtistsViewEntitySchema>;
