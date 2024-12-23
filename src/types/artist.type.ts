import { z } from 'zod';

export const ArtistSchema = z.object({
  ID: z.number().int(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ArtistType = z.infer<typeof ArtistSchema>;

export const ArtistListSchema = z.array(ArtistSchema);
