import { z } from 'zod';

export const ArtistViewEntity = z
  .object({
    artistId: z.number().int(),
    artistName: z.string(),
  })
  .strict();

export type ArtistsView = z.infer<typeof ArtistViewEntity>;
